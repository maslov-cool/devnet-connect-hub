
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
    
    // Проверка обязательных полей
    if (empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'error' => 'Отсутствуют обязательные поля']);
        exit;
    }
    
    // Здесь должен быть подключен автозагрузчик Composer
    // require 'vendor/autoload.php';
    
    // Поскольку мы в демонстрационном режиме, просто имитируем отправку
    // и возвращаем успешный результат
    
    /*
    // Реальный код отправки письма
    try {
        $mail = new PHPMailer(true);
        
        // Настройки SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.example.com'; // Адрес SMTP-сервера
        $mail->SMTPAuth = true;
        $mail->Username = 'your-email@example.com'; // Email отправителя
        $mail->Password = 'your-email-password'; // Пароль почты отправителя
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        
        // Отправитель и получатель
        $mail->setFrom('no-reply@devnet.com', 'DevNet');
        $mail->addAddress($email, $name);
        
        // Содержимое письма
        $mail->isHTML(true);
        $mail->Subject = "DevNet: " . ($name ? "Сообщение для " . $name : "Важное уведомление");
        $mail->Body = nl2br($message);
        
        $mail->send();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
    }
    */
    
    // Для демонстрации просто выводим данные
    $logFile = __DIR__ . '/email_log.txt';
    $logMessage = date('Y-m-d H:i:s') . " - Отправка письма на $email: $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
    
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Некорректный запрос']);
}
?>
