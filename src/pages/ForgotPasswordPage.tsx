
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const { forgotPassword } = useAuth();
  const { t } = useTranslation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t("language") === "ru" ? "Пожалуйста, введите email" : "Please enter your email");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await forgotPassword(email);
      
      if (success) {
        setIsSent(true);
        toast.success(t("language") === "ru" 
          ? "Инструкции по сбросу пароля отправлены на вашу почту" 
          : "Password reset instructions have been sent to your email");
      } else {
        toast.error(t("language") === "ru" 
          ? "Пользователь с таким email не найден" 
          : "User with this email not found");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("language") === "ru" ? "Произошла ошибка при обработке запроса" : "An error occurred while processing your request");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/login" className="flex justify-start w-full mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-900 dark:text-blue-300 hover:text-blue-600"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t("language") === "ru" ? "Назад к входу" : "Back to login"}
            </Button>
          </Link>
          <CardTitle>{t("resetPassword")}</CardTitle>
          <CardDescription>
            {t("language") === "ru" 
              ? "Введите email, на который зарегистрирован аккаунт"
              : "Enter the email address associated with your account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSent ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    {t("email")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("language") === "ru" ? "Введите email" : "Enter your email"}
                    autoComplete="email"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("language") === "ru" ? "Загрузка..." : "Loading..."}
                    </span>
                  ) : (
                    t("sendResetLink")
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="mb-4 bg-green-100 text-green-800 p-4 rounded-md">
                <p>
                  {t("language") === "ru" 
                    ? "Инструкции по сбросу пароля отправлены на ваш email"
                    : "Password reset instructions have been sent to your email"
                  }
                </p>
                <p className="text-sm mt-2">
                  {t("language") === "ru" 
                    ? "Пожалуйста, проверьте вашу почту и следуйте инструкциям"
                    : "Please check your email and follow the instructions"
                  }
                </p>
              </div>
              <Button asChild>
                <Link to="/login">{t("login")}</Link>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("language") === "ru" 
              ? "Вспомнили пароль? "
              : "Remembered your password? "
            }
            <Link to="/login" className="text-blue-900 dark:text-blue-300 hover:underline">
              {t("language") === "ru" ? "Вернуться к входу" : "Back to login"}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
