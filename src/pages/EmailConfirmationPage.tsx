
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const EmailConfirmationPage = () => {
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        setVerifying(true);
        
        // Get token from URL params
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const email = queryParams.get('email');
        
        if (!token || !email) {
          toast.error(t("language") === "ru" 
            ? "Недостаточно данных для подтверждения email" 
            : "Insufficient data for email verification");
          setVerified(false);
          setVerifying(false);
          return;
        }
        
        // Verify email with token
        const result = await verifyEmail(email);
        
        if (result) {
          toast.success(t("language") === "ru" 
            ? "Email успешно подтвержден" 
            : "Email verified successfully");
          setVerified(true);
        } else {
          toast.error(t("language") === "ru" 
            ? "Ошибка подтверждения email" 
            : "Failed to verify email");
          setVerified(false);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        toast.error(t("language") === "ru" 
          ? "Ошибка подтверждения email" 
          : "Error verifying email");
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    };
    
    verifyEmailToken();
  }, [location.search, verifyEmail]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t("language") === "ru" ? "Подтверждение Email" : "Email Verification"}</CardTitle>
          <CardDescription>
            {verifying 
              ? t("language") === "ru" ? "Проверяем ваш email..." : "Verifying your email..." 
              : verified 
                ? t("language") === "ru" ? "Ваш email был подтвержден" : "Your email has been verified"
                : t("language") === "ru" ? "Не удалось подтвердить email" : "Failed to verify email"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {verifying ? (
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
          ) : verified ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/login")}>
            {t("language") === "ru" ? "Перейти на страницу входа" : "Go to login page"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailConfirmationPage;
