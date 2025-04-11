
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Allow CORS for requests from our domain
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Create a debug log function
function logDebug($message) {
    $logFile = __DIR__ . '/email_debug_log.txt';
    $formattedMessage = date('Y-m-d H:i:s') . " - " . $message . "\n";
    file_put_contents($logFile, $formattedMessage, FILE_APPEND);
}

// Start logging
logDebug("Email script started");

// Get data from request body
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

logDebug("Received data: " . print_r($data, true));

if ($_SERVER["REQUEST_METHOD"] == "POST" && $data) {
    $name = isset($data['name']) ? htmlspecialchars($data['name']) : '';
    $email = isset($data['email']) ? htmlspecialchars($data['email']) : '';
    $message = isset($data['message']) ? $data['message'] : ''; // Don't escape HTML for email content
    $subject = isset($data['subject']) ? htmlspecialchars($data['subject']) : 'DevNet: Важное уведомление';
    
    // Validate required fields
    if (empty($email) || empty($message)) {
        logDebug("Missing required fields");
        echo json_encode(['success' => false, 'error' => 'Отсутствуют обязательные поля']);
        exit;
    }
    
    try {
        logDebug("Attempting to load PHPMailer");
        
        // Check if composer autoload exists
        if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
            logDebug("Composer autoload not found");
            echo json_encode(['success' => false, 'error' => 'PHPMailer not installed. Please run composer require phpmailer/phpmailer']);
            exit;
        }
        
        // Load PHPMailer
        require __DIR__ . '/vendor/autoload.php';
        
        // Create a new PHPMailer instance
        $mail = new PHPMailer(true);
        
        // Enable verbose debug output
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        
        // Capture SMTP debug output
        $debugOutput = "";
        $mail->Debugoutput = function($str, $level) use (&$debugOutput) {
            $debugOutput .= "$str\n";
            logDebug("SMTP Debug: $str");
        };
        
        // SMTP configuration for Gmail
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'am1646789@gmail.com';
        $mail->Password = 'qasdfxbhejrbdhdi';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        
        // Sender and recipient
        $mail->setFrom('am1646789@gmail.com', 'DevNet');
        $mail->addAddress($email, $name);
        
        // Email content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        
        logDebug("Attempting to send email to: $email");
        
        // Send email
        $mail->send();
        
        // Log successful email
        logDebug("Email successfully sent to: $email");
        
        echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
    } catch (Exception $e) {
        // Log error details
        logDebug("Error: " . $mail->ErrorInfo);
        logDebug("Debug output: " . $debugOutput);
        
        echo json_encode([
            'success' => false, 
            'error' => $mail->ErrorInfo,
            'debug' => $debugOutput
        ]);
    }
} else {
    logDebug("Invalid request method or missing data");
    echo json_encode(['success' => false, 'error' => 'Некорректный запрос']);
}
?>
