
import { useState } from 'react';
import { toast } from 'sonner';

interface EmailData {
  name?: string;
  email: string;
  message: string;
  subject?: string;
}

export const useEmailService = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (data: EmailData): Promise<boolean> => {
    setIsSending(true);
    setError(null);
    
    try {
      console.log('Отправка письма через PHP:', data);
      
      // Реальный запрос к PHP-скрипту на сервере
      const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name || 'DevNet User',
          email: data.email,
          message: data.message,
          subject: data.subject || `DevNet: ${data.name ? "Сообщение для " + data.name : "Важное уведомление"}`,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Письмо успешно отправлено');
        return true;
      } else {
        const errorMessage = result.error || 'Ошибка при отправке письма';
        setError(errorMessage);
        toast.error(`Ошибка: ${errorMessage}`);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при отправке письма';
      console.error('Ошибка при отправке письма:', errorMessage);
      setError(errorMessage);
      toast.error(`Ошибка отправки: ${errorMessage}`);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { sendEmail, isSending, error };
};
