
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t("language") === "ru" ? "Пожалуйста, заполните все поля" : "Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast.success(t("language") === "ru" ? "Успешный вход" : "Login successful");
        navigate("/");
      } else {
        toast.error(t("language") === "ru" ? "Неверный email или пароль" : "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("language") === "ru" ? "Произошла ошибка при входе" : "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-start w-full mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="text-blue-900 dark:text-blue-300 hover:text-blue-600"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t("goBack")}
            </Button>
          </div>
          <CardTitle>{t("login")}</CardTitle>
          <CardDescription>
            {t("language") === "ru" ? "Войдите в свой аккаунт для доступа к DevNet" : "Login to your account to access DevNet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  {t("language") === "ru" ? "Email" : "Email"}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("language") === "ru" ? "Введите email" : "Enter email"}
                  autoComplete="email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  {t("password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("language") === "ru" ? "Введите пароль" : "Enter password"}
                  autoComplete="current-password"
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
                  t("login")
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("language") === "ru" ? "Нет аккаунта? " : "Don't have an account? "}
            <Link to="/register" className="text-blue-900 dark:text-blue-300 hover:underline">
              {t("register")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
