<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$keyId = getenv('RAZORPAY_KEY_ID') ?: 'YOUR_RAZORPAY_KEY_ID';
$keySecret = getenv('RAZORPAY_KEY_SECRET') ?: 'YOUR_RAZORPAY_KEY_SECRET';
?>
