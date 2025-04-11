
import { useState } from 'react';

interface EmailData {
  name?: string;
  email: string;
  message: string;
}

export const useEmailService = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (data: EmailData): Promise<boolean> => {
    setIsSending(true);
    setError(null);
    
    try {
      // В реальном приложении здесь был бы запрос к PHP-скрипту
      console.log('Отправка письма через PHP:', data);
      
      // Эмуляция запроса к PHP API
      // В реальном приложении здесь должен быть реальный HTTP запрос
      const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      // Эмуляция ответа от PHP-скрипта
      const result = { success: true };
      
      if (result.success) {
        return true;
      } else {
        setError('Ошибка при отправке письма');
        return false;
      }
    } catch (err) {
      console.error('Ошибка при отправке письма:', err);
      setError('Произошла ошибка при отправке письма');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { sendEmail, isSending, error };
};
