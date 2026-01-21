<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

$razorpayOrderId = isset($input['razorpay_order_id']) ? $input['razorpay_order_id'] : '';
$razorpayPaymentId = isset($input['razorpay_payment_id']) ? $input['razorpay_payment_id'] : '';
$razorpaySignature = isset($input['razorpay_signature']) ? $input['razorpay_signature'] : '';

if (empty($razorpayOrderId) || empty($razorpayPaymentId) || empty($razorpaySignature)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing payment details']);
    exit();
}

$generatedSignature = hash_hmac(
    'sha256',
    $razorpayOrderId . '|' . $razorpayPaymentId,
    $keySecret
);

if (hash_equals($generatedSignature, $razorpaySignature)) {
    echo json_encode([
        'status' => 'success',
        'success' => true,
        'message' => 'Payment verified successfully'
    ]);
} else {
    http_response_code(400);
    echo json_encode([
        'status' => 'failure',
        'success' => false,
        'error' => 'Invalid payment signature'
    ]);
}
?>
