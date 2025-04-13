
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    // Get email from URL params
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      toast.error(t("language") === "ru" 
        ? "Email не указан" 
        : "Email is not specified");
      navigate('/forgot-password');
    }
  }, [location.search, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error(t("language") === "ru" ? "Пожалуйста, заполните все поля" : "Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t("language") === "ru" ? "Пароли не совпадают" : "Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      toast.error(t("language") === "ru" 
        ? "Пароль должен содержать не менее 6 символов" 
        : "Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await resetPassword(email, password);
      
      if (success) {
        toast.success(t("language") === "ru" ? "Пароль успешно изменен" : "Password successfully reset");
        navigate("/login");
      } else {
        toast.error(t("language") === "ru" ? "Не удалось изменить пароль" : "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("language") === "ru" ? "Произошла ошибка" : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t("language") === "ru" ? "Сброс пароля" : "Reset Password"}</CardTitle>
          <CardDescription>
            {t("language") === "ru" 
              ? "Создайте новый пароль для вашей учетной записи" 
              : "Create a new password for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  {t("language") === "ru" ? "Новый пароль" : "New Password"}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("language") === "ru" ? "Введите новый пароль" : "Enter new password"}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  {t("language") === "ru" ? "Подтвердите пароль" : "Confirm Password"}
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("language") === "ru" ? "Подтвердите пароль" : "Confirm password"}
                  />
                </div>
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
                  t("language") === "ru" ? "Изменить пароль" : "Reset Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate("/login")}>
            {t("language") === "ru" ? "Вернуться на страницу входа" : "Back to login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
