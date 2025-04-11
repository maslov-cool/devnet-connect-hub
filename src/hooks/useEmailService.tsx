
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
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  const sendEmail = async (data: EmailData): Promise<boolean> => {
    setIsSending(true);
    setError(null);
    setDebug(null);
    setRawResponse(null);
    
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
      setRawResponse(responseText);
      
      // Check if the response is empty
      if (!responseText || responseText.trim() === '') {
        console.error('Empty response from server');
        throw new Error('Server returned an empty response');
      }
      
      let result;
      try {
        // Try to parse as JSON
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        setError(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
        toast.error(`JSON parsing error: ${e instanceof Error ? e.message : 'Unknown error'}`);
        return false;
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

  return { sendEmail, isSending, error, debug, rawResponse };
};
