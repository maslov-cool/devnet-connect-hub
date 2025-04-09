
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [vkLink, setVkLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("0-1");
  const [specialization, setSpecialization] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error(t("Пожалуйста, заполните все обязательные поля"));
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t("Пароли не совпадают"));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Преобразуем навыки в массив
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(Boolean);
      
      // Дополнительные данные профиля
      const profileData = {
        vkLink,
        telegramLink,
        githubLink,
        skills: skillsArray,
        experience,
        specialization
      };
      
      const success = await register(username, email, password, profileData);
      
      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("Произошла ошибка при регистрации"));
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
          <CardTitle>{t("register")}</CardTitle>
          <CardDescription>
            {t("Создайте аккаунт для доступа к DevNet")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-2">
              <div className="flex justify-center mb-2">
                <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-dashed border-muted-foreground/50 hover:border-blue-900 flex items-center justify-center bg-muted">
                  {selectedFile ? (
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-center text-muted-foreground p-2">
                      {t("Нажмите, чтобы загрузить аватар")}
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
                {t("username")} *
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("Введите имя пользователя")}
                autoComplete="username"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                {t("email")} *
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Введите email")}
                autoComplete="email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="vk" className="block text-sm font-medium mb-1">
                {t("vkLink")}
              </label>
              <Input
                id="vk"
                type="text"
                value={vkLink}
                onChange={(e) => setVkLink(e.target.value)}
                placeholder="https://vk.com/username"
              />
            </div>
            
            <div>
              <label htmlFor="telegram" className="block text-sm font-medium mb-1">
                {t("telegramLink")}
              </label>
              <Input
                id="telegram"
                type="text"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                placeholder="https://t.me/username"
              />
            </div>
            
            <div>
              <label htmlFor="github" className="block text-sm font-medium mb-1">
                {t("githubLink")}
              </label>
              <Input
                id="github"
                type="text"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            
            <div>
              <label htmlFor="skills" className="block text-sm font-medium mb-1">
                {t("skills")}
              </label>
              <Input
                id="skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, JavaScript, TypeScript..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("Разделяйте навыки запятыми")}
              </p>
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium mb-1">
                {t("experience")}
              </label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Выберите опыт работы")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 {t("лет")}</SelectItem>
                  <SelectItem value="1-3">1-3 {t("лет")}</SelectItem>
                  <SelectItem value="3-5">3-5 {t("лет")}</SelectItem>
                  <SelectItem value="5+">5+ {t("лет")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium mb-1">
                {t("specialization")}
              </label>
              <Textarea
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder={t("Опишите ваше основное направление разработки")}
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                {t("password")} *
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Введите пароль")}
                autoComplete="new-password"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                {t("Подтверждение пароля")} *
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("Подтвердите пароль")}
                autoComplete="new-password"
                required
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
                  {t("Загрузка...")}
                </span>
              ) : (
                t("register")
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              * {t("Обязательные поля")}
            </p>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("Уже есть аккаунт? ")}
            <Link to="/login" className="text-blue-900 dark:text-blue-300 hover:underline">
              {t("login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
