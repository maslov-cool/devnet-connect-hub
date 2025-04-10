
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error(t("language") === "ru" ? "Пожалуйста, заполните все поля" : "Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t("language") === "ru" ? "Пароли не совпадают" : "Passwords do not match");
      return;
    }
    
    if (!token || !email) {
      toast.error(t("language") === "ru" ? "Некорректная ссылка для сброса пароля" : "Invalid password reset link");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await resetPassword(email, password, token);
      
      if (success) {
        toast.success(t("language") === "ru" ? "Пароль успешно изменен" : "Password has been reset successfully");
        navigate("/login");
      } else {
        toast.error(t("language") === "ru" ? "Не удалось сбросить пароль" : "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("language") === "ru" ? "Произошла ошибка при сбросе пароля" : "An error occurred while resetting your password");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-500">
              {t("language") === "ru" ? "Ошибка" : "Error"}
            </CardTitle>
            <CardDescription>
              {t("language") === "ru" 
                ? "Некорректная ссылка для сброса пароля"
                : "Invalid password reset link"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate("/forgot-password")}>
              {t("language") === "ru" ? "Попробовать снова" : "Try again"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t("language") === "ru" ? "Создание нового пароля" : "Create New Password"}</CardTitle>
          <CardDescription>
            {t("language") === "ru" 
              ? "Введите новый пароль для вашего аккаунта"
              : "Enter a new password for your account"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  {t("language") === "ru" ? "Новый пароль" : "New Password"}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("language") === "ru" ? "Введите новый пароль" : "Enter new password"}
                  autoComplete="new-password"
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                  {t("language") === "ru" ? "Подтверждение пароля" : "Confirm Password"}
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("language") === "ru" ? "Подтвердите новый пароль" : "Confirm new password"}
                  autoComplete="new-password"
                />
              </div>
              
              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading}>
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
                  t("language") === "ru" ? "Сохранить новый пароль" : "Save New Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
