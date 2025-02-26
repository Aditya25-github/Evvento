<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php'; // 

// ✅ Enable CORS (for API requests)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// ✅ Ensure only POST requests are allowed
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "❌ Method Not Allowed. Use POST."]);
    exit();
}

// ✅ Read & Decode JSON Data
$jsonData = trim(file_get_contents("php://input"));
error_log("📜 Received JSON: " . $jsonData); // Debugging log

$data = json_decode($jsonData, true);

// ✅ Validate JSON Data
if (!$data || json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["error" => "❌ Invalid JSON Format: " . json_last_error_msg()]);
    exit();
}

// ✅ Validate Required Fields
$required_fields = ["name", "team_name", "team_size", "ticket_quantity", "email", "phone", "event_name", "amount_paid", "transaction_id"];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "❌ Missing Field: $field"]);
        exit();
    }
}

// ✅ PostgreSQL Database Connection
$host = "localhost";
$port = "5432";
$dbname = "Evvento";
$user = "postgres";
$password = "Aditya25@";

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "❌ Database Connection Failed: " . pg_last_error()]);
    exit();
}

// ✅ Insert Data into PostgreSQL
$query = "INSERT INTO ticket_bookings (name, team_name, team_size, ticket_quantity, email, phone, event_name, amount_paid, transaction_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";

$result = pg_query_params($conn, $query, [
    htmlspecialchars($data["name"]), 
    htmlspecialchars($data["team_name"]), 
    (int) $data["team_size"], 
    (int) $data["ticket_quantity"], 
    filter_var($data["email"], FILTER_SANITIZE_EMAIL), 
    htmlspecialchars($data["phone"]), 
    htmlspecialchars($data["event_name"]), 
    (float) $data["amount_paid"], 
    htmlspecialchars($data["transaction_id"])
]);

// ✅ If database insertion fails, exit early
if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "❌ Error Inserting Data: " . pg_last_error($conn)]);
    pg_close($conn);
    exit();
}

// ✅ Ensure `tickets/` folder exists
$ticketDir = __DIR__ . "/tickets";
if (!is_dir($ticketDir)) {
    mkdir($ticketDir, 0777, true);
}


// ✅ Generate Ticket PDF
$pdfPath = __DIR__ . "/tickets/Ticket_{$data['transaction_id']}.pdf"; // Absolute path for reliability
$mpdf = new \Mpdf\Mpdf();
$ticketHTML = "
    <h1 style='color: orange;'>Evvento Ticket</h1>
    <p><strong>Event:</strong> {$data['event_name']}</p>
    <p><strong>Tickets:</strong> {$data['ticket_quantity']}</p>
    <p><strong>Email:</strong> {$data['email']}</p>
    <p><strong>Phone:</strong> {$data['phone']}</p>
    <p><strong>Transaction ID:</strong> {$data['transaction_id']}</p>
    <p><strong>Amount Paid:</strong> ₹{$data['amount_paid']}</p>
    <br>
    <p style='color: gray;'>Show this ticket at the event entrance.</p>
";
$mpdf->WriteHTML($ticketHTML);
$mpdf->Output($pdfPath, "F"); // Save PDF file

// ✅ Send Email with Ticket
function sendTicketEmail($email, $name, $pdfPath) {
    $mail = new PHPMailer(true);

    try {
        // ✅ Configure SMTP Server
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Change if using another provider
        $mail->SMTPAuth = true;
        $mail->Username = 'adityadivate25@gmail.com'; // ✅ Use your email
        $mail->Password = 'iozb mwwx viaz yygx'; // ✅ Use an App Password (not your actual password)
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // ✅ Email Sender & Receiver
        $mail->setFrom('adityadivate25@gmail.com', 'Evvento Tickets');
        $mail->addAddress($email, $name);

        // ✅ Email Content
        $mail->isHTML(true);
        $mail->Subject = 'Your Evvento Ticket';
        $mail->Body = "
            <h3>Hi $name,</h3>
            <p>Your ticket has been successfully booked! 🎉</p>
            <p>Find your attached ticket below.</p>
            <br>
            <p>Best Regards,<br>Evvento Team</p>
        ";

        // ✅ Attach Ticket PDF
        $mail->addAttachment($pdfPath, 'Evvento_Ticket.pdf');

        // ✅ Send Email
        $mail->send();
        return "✅ Ticket sent to $email";
    } catch (Exception $e) {
        error_log("❌ Email Error: " . $mail->ErrorInfo);
        return "❌ Email Error: " . $mail->ErrorInfo;
    }
}

// ✅ Send Email After Successful Database Insert
$emailStatus = sendTicketEmail($data['email'], $data['name'], $pdfPath);

// ✅ Return Success Response
echo json_encode([
    "success" => "✅ Payment Recorded Successfully!",
    "email_status" => $emailStatus
]);

pg_close($conn); // ✅ Close the database connection
?>
