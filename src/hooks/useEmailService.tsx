
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
  const [debug, setDebug] = useState<string | null>(null);

  const sendEmail = async (data: EmailData): Promise<boolean> => {
    setIsSending(true);
    setError(null);
    setDebug(null);
    
    try {
      console.log('Sending email via PHP:', data);
      
      // Send request to our PHP script
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
      
      // Get response as text first to debug potential JSON parsing issues
      const responseText = await response.text();
      console.log('Raw PHP response:', responseText);
      
      let result;
      try {
        // Try to parse as JSON
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
      }
      
      if (result.success) {
        toast.success('Email sent successfully');
        return true;
      } else {
        // Save error information
        const errorMessage = result.error || 'Error sending email';
        setError(errorMessage);
        
        // Save debug info if available
        if (result.debug) {
          setDebug(result.debug);
          console.log('SMTP Debug:', result.debug);
        }
        
        toast.error(`Error: ${errorMessage}`);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error sending email';
      console.error('Email sending error:', errorMessage);
      setError(errorMessage);
      toast.error(`Sending error: ${errorMessage}`);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return { sendEmail, isSending, error, debug };
};
