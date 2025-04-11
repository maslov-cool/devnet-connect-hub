
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Разрешаем CORS для запросов с нашего домена
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Если это preflight OPTIONS запрос, завершаем обработку
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Получаем данные из тела запроса
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if ($_SERVER["REQUEST_METHOD"] == "POST" && $data) {
    $name = isset($data['name']) ? htmlspecialchars($data['name']) : '';
    $email = isset($data['email']) ? htmlspecialchars($data['email']) : '';
    $message = isset($data['message']) ? htmlspecialchars($data['message']) : '';
    $subject = isset($data['subject']) ? htmlspecialchars($data['subject']) : 'DevNet: Важное уведомление';
    
    // Проверка обязательных полей
    if (empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'error' => 'Отсутствуют обязательные поля']);
        exit;
    }
    
    // Подключаем автозагрузчик Composer
    require 'vendor/autoload.php';
    
    try {
        $mail = new PHPMailer(true);
        
        // Настройки SMTP для Gmail
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'am1646789@gmail.com'; // Используем предоставленный email
        $mail->Password = 'qasdfxbhejrbdhdi'; // Используем предоставленный пароль
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        
        // Получатель и отправитель
        $mail->setFrom('am1646789@gmail.com', 'DevNet');
        $mail->addAddress($email, $name); // Отправляем на email пользователя
        
        // Содержимое письма
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;
        
        $mail->send();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        // Записываем ошибку в лог для отладки
        $logFile = __DIR__ . '/email_error_log.txt';
        $logMessage = date('Y-m-d H:i:s') . " - Ошибка отправки письма на $email: " . $mail->ErrorInfo . "\n";
        file_put_contents($logFile, $logMessage, FILE_APPEND);
        
        echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
        exit;
    }
    
    // Для отладки и демонстрации записываем в лог
    $logFile = __DIR__ . '/email_log.txt';
    $logMessage = date('Y-m-d H:i:s') . " - Отправка письма на $email: $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
    
} else {
    echo json_encode(['success' => false, 'error' => 'Некорректный запрос']);
}
?>
