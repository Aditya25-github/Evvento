<?php
require __DIR__ . '/vendor/autoload.php'; // ✅ Ensure correct path to Razorpay SDK

use Razorpay\Api\Api;

// ✅ Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ Read JSON Input
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

error_log("📥 Received JSON: " . json_encode($data, JSON_PRETTY_PRINT)); // ✅ Debugging

// ✅ Validate Required Fields (REMOVE transaction_id)
$required_fields = ["name", "team_name", "team_size", "ticket_quantity", "email", "phone", "event_name", "amount"];
foreach ($required_fields as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        die(json_encode(["error" => "❌ Missing Required Field: $field"]));
    }
}

// ✅ Ensure `amount` is in paise (multiply by 100)
$amountInPaise = (int) $data["amount"];
if ($amountInPaise <= 0) {
    http_response_code(400);
    die(json_encode(["error" => "❌ Invalid Amount"]));
}

// ✅ Razorpay API Credentials
$keyId = "rzp_test_VZbWUm7n2JeXwc";
$keySecret = "QrYklRNGhKuXAw39mikSvJF3";
$api = new Api($keyId, $keySecret);

try {
    // ✅ Create Order in Razorpay
    $orderData = [
        'receipt'         => uniqid(),
        'amount'          => $amountInPaise, // ✅ Amount in paise
        'currency'        => 'INR',
        'payment_capture' => 1
    ];

    $order = $api->order->create($orderData);

    echo json_encode(["id" => $order['id'], "amount" => $order['amount']]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "❌ Razorpay API Error: " . $e->getMessage()]);
}
?>
