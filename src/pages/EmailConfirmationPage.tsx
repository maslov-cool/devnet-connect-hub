
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";

const EmailConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    
    if (!email) {
      setIsVerifying(false);
      setIsSuccess(false);
      return;
    }
    
    const verifyEmailAsync = async () => {
      try {
        // Use verifyEmail with only email parameter
        const success = await verifyEmail(email);
        
        setIsSuccess(success);
        setIsVerifying(false);
      } catch (error) {
        console.error("Email verification error:", error);
        setIsSuccess(false);
        setIsVerifying(false);
      }
    };
    
    verifyEmailAsync();
  }, [location.search, verifyEmail]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t("language") === "ru" ? "Подтверждение Email" : "Email Confirmation"}</CardTitle>
          <CardDescription>
            {isVerifying 
              ? t("language") === "ru" ? "Проверка вашего email..." : "Verifying your email..."
              : isSuccess 
                ? t("language") === "ru" ? "Ваш email успешно подтвержден!" : "Your email has been successfully verified!"
                : t("language") === "ru" ? "Не удалось подтвердить email." : "Failed to verify email."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {isVerifying ? (
            <div className="animate-spin h-16 w-16 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          ) : isSuccess ? (
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
          )}
          
          {!isVerifying && (
            <Button 
              onClick={() => navigate("/login")}
              className="mt-4"
            >
              {t("login")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmationPage;
