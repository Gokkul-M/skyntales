<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['cartItems']) || !is_array($input['cartItems'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Cart items are required']);
    exit();
}

$cartItems = $input['cartItems'];
$shippingState = isset($input['shippingState']) ? $input['shippingState'] : '';
$currency = isset($input['currency']) ? $input['currency'] : 'INR';

$subtotal = 0;
foreach ($cartItems as $item) {
    $subtotal += floatval($item['price']) * intval($item['quantity']);
}

$shippingCost = 0;
if (!empty($shippingState)) {
    $isTamilNadu = stripos(strtolower($shippingState), 'tamil') !== false;
    $shippingCost = $isTamilNadu ? 50 : 100;
}

$total = $subtotal + $shippingCost;
$amountInPaise = round($total * 100);

$orderData = [
    'amount' => $amountInPaise,
    'currency' => $currency,
    'receipt' => 'rcpt_' . time(),
    'payment_capture' => 1
];

$ch = curl_init('https://api.razorpay.com/v1/orders');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_USERPWD, $keyId . ':' . $keySecret);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create Razorpay order']);
    exit();
}

$razorpayOrder = json_decode($response, true);

echo json_encode([
    'order_id' => $razorpayOrder['id'],
    'id' => $razorpayOrder['id'],
    'amount' => $razorpayOrder['amount'],
    'currency' => $razorpayOrder['currency']
]);
?>
