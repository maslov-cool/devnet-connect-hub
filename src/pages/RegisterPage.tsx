
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { toast } from "sonner";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error(t("language") === "ru" ? "Пожалуйста, заполните все поля" : "Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t("language") === "ru" ? "Пароли не совпадают" : "Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(username, email, password);
      
      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("language") === "ru" ? "Произошла ошибка при регистрации" : "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-brand-DEFAULT text-white w-10 h-10 rounded flex items-center justify-center text-xl font-bold">
              D
            </div>
            <span className="text-xl font-bold">DevNet</span>
          </Link>
          <CardTitle>{t("register")}</CardTitle>
          <CardDescription>
            {t("language") === "ru" 
              ? "Создайте аккаунт для доступа к DevNet"
              : "Create an account to access DevNet"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="text-center mb-2">
                <div className="flex justify-center mb-2">
                  <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-dashed border-muted-foreground/50 hover:border-brand-DEFAULT flex items-center justify-center bg-muted">
                    {selectedFile ? (
                      <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-center text-muted-foreground p-2">
                        {t("language") === "ru" 
                          ? "Нажмите, чтобы загрузить аватар" 
                          : "Click to upload avatar"
                        }
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  {t("username")}
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("language") === "ru" ? "Введите имя пользователя" : "Enter your username"}
                  autoComplete="username"
                />
              </div>
              
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
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  {t("password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("language") === "ru" ? "Введите пароль" : "Enter your password"}
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
                  placeholder={t("language") === "ru" ? "Подтвердите пароль" : "Confirm your password"}
                  autoComplete="new-password"
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
                  t("register")
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("language") === "ru" ? "Уже есть аккаунт? " : "Already have an account? "}
            <Link to="/login" className="text-brand-DEFAULT hover:underline">
              {t("login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
