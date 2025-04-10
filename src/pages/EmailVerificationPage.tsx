
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "../hooks/useTranslation";
import { CheckCircle2 } from "lucide-react";

const EmailVerificationPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle>{t("language") === "ru" ? "Проверьте вашу почту" : "Check Your Email"}</CardTitle>
          <CardDescription>
            {t("language") === "ru" 
              ? "Мы отправили письмо с подтверждением на указанный вами адрес электронной почты"
              : "We've sent a verification email to your email address"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <p>
              {t("language") === "ru" 
                ? "Пожалуйста, проверьте вашу почту и следуйте инструкциям для подтверждения аккаунта."
                : "Please check your inbox and follow the instructions to verify your account."
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {t("language") === "ru" 
                ? "Если вы не получили письмо, проверьте папку 'Спам' или 'Нежелательная почта'."
                : "If you don't see the email, check your spam or junk folder."
              }
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="space-y-2 w-full">
            <Button asChild className="w-full">
              <Link to="/login">
                {t("language") === "ru" ? "Перейти к странице входа" : "Go to login page"}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                {t("language") === "ru" ? "Вернуться на главную" : "Return to home page"}
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;
