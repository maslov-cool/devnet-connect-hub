import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const EmailConfirmationPage = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  
  useEffect(() => {
    const verify = async () => {
      if (!token || !email) {
        setIsVerifying(false);
        return;
      }
      
      try {
        const success = await verifyEmail(email, token);
        setIsSuccess(success);
        
        if (success) {
          toast.success(t("language") === "ru" 
            ? "Email успешно подтвержден! Теперь вы можете войти в систему." 
            : "Email successfully verified! You can now log in.");
        }
      } catch (error) {
        console.error(error);
        setIsSuccess(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verify();
  }, [token, email, verifyEmail, t]);
  
  const handleConfirmClick = async () => {
    if (!token || !email) return;
    
    try {
      setIsVerifying(true);
      const success = await verifyEmail(email, token);
      
      if (success) {
        setIsSuccess(true);
        toast.success(t("language") === "ru" 
          ? "Email успешно подтвержден! Теперь вы можете войти в систему." 
          : "Email successfully verified! You can now log in.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(t("language") === "ru" 
          ? "Не удалось подтвердить email" 
          : "Failed to verify email");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("language") === "ru" 
        ? "Произошла ошибка при подтверждении email" 
        : "An error occurred while verifying your email");
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {isVerifying ? (
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            </div>
          ) : isSuccess ? (
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
          )}
          <CardTitle>
            {isVerifying
              ? t("language") === "ru" ? "Подтверждение email..." : "Verifying email..."
              : isSuccess
              ? t("language") === "ru" ? "Email подтвержден" : "Email Verified"
              : t("language") === "ru" ? "Ошибка подтверждения" : "Verification Error"
            }
          </CardTitle>
          <CardDescription>
            {isVerifying
              ? t("language") === "ru" ? "Пожалуйста, подождите..." : "Please wait..."
              : isSuccess
              ? t("language") === "ru" 
                ? "Ваш email был успешно подтвержден! Аккаунт активирован." 
                : "Your email has been successfully verified! Account activated."
              : t("language") === "ru" 
                ? "Возникла проблема при подтверждении вашего email" 
                : "There was an issue verifying your email"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {isVerifying ? (
            <p>
              {t("language") === "ru" 
                ? "Проверяем ваш email. Это может занять несколько секунд." 
                : "We're verifying your email. This may take a few seconds."
              }
            </p>
          ) : isSuccess ? (
            <div className="space-y-4">
              <p>
                {t("language") === "ru" 
                  ? "Ваш аккаунт теперь активирован. Вы можете войти в систему." 
                  : "Your account is now activated. You can log in."
                }
              </p>
              <Button 
                onClick={() => navigate("/login")} 
                className="w-full bg-blue-900 hover:bg-blue-800"
              >
                {t("language") === "ru" ? "Перейти к странице входа" : "Go to login page"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p>
                {t("language") === "ru" 
                  ? "Ссылка для подтверждения недействительна или устарела." 
                  : "The verification link is invalid or has expired."
                }
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleConfirmClick}
                  disabled={!token || !email || isVerifying}
                  className="w-full"
                >
                  {t("language") === "ru" ? "Попробовать снова" : "Try again"}
                </Button>
                <Button 
                  onClick={() => navigate("/")} 
                  variant="outline"
                  className="w-full"
                >
                  {t("language") === "ru" ? "Вернуться на главную" : "Return to home page"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmationPage;
