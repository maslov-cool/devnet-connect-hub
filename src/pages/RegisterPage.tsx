import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const programmingLanguages = [
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "PHP", "Ruby", "Swift", 
  "Kotlin", "Go", "Rust", "Dart", "Scala", "Haskell", "Elixir", "Clojure", 
  "Objective-C", "R", "MATLAB", "Lua", "Perl", "Shell", "SQL", "HTML/CSS"
];

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [experience, setExperience] = useState("0-1");
  const [itPosition, setITPosition] = useState("");
  const [projects, setProjects] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useRandomAvatar, setUseRandomAvatar] = useState(false);
  const [skipAvatar, setSkipAvatar] = useState(false);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (generatingAvatar) {
      setGenerationProgress(0);
      setGeneratedAvatarUrl(null);
      
      interval = window.setInterval(() => {
        setGenerationProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setGeneratingAvatar(false);
            clearInterval(interval);
            
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            const randomAvatar = `https://api.dicebear.com/6.x/bottts/svg?seed=${Date.now()}&backgroundColor=${randomColor}`;
            setGeneratedAvatarUrl(randomAvatar);
            
            return 100;
          }
          return prevProgress + 10;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [generatingAvatar]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword || selectedLanguages.length === 0 || !experience || !itPosition || !projects) {
      toast.error(t("language") === "ru" ? "Пожалуйста, заполните все обязательные поля" : "Please fill in all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error(t("language") === "ru" ? "Пароли не совпадают" : "Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const registrationDate = new Date().toISOString().split("T")[0];
      const profileData = {
        telegramLink,
        githubLink,
        languages: selectedLanguages,
        experience,
        itPosition,
        projects,
        useRandomAvatar: useRandomAvatar || !!generatedAvatarUrl,
        skipAvatar,
        generatedAvatarUrl,
        registrationDate
      };
      
      const success = await register(username, email, password, profileData);
      
      if (success) {
        toast.success(t("language") === "ru" 
          ? "Регистрация успешна!" 
          : "Registration successful!");
        navigate("/recommended-users");
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
      setUseRandomAvatar(false);
      setSkipAvatar(false);
      setGeneratedAvatarUrl(null);
    }
  };
  
  const generateRandomAvatar = () => {
    setUseRandomAvatar(true);
    setSelectedFile(null);
    setSkipAvatar(false);
    setGeneratingAvatar(true);
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-start w-full mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/login")}
              className="text-blue-900 dark:text-blue-300 hover:text-blue-600"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t("language") === "ru" ? "Вернуться ко входу" : "Back to login"}
            </Button>
          </div>
          <CardTitle>{t("register")}</CardTitle>
          <CardDescription>
            {t("language") === "ru" ? "Создайте аккаунт для доступа к DevNet" : "Create an account to access DevNet"}
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
                  ) : generatingAvatar ? (
                    <div className="flex items-center justify-center flex-col w-full h-full">
                      <RefreshCw className="w-8 h-8 text-blue-500 dark:text-blue-200 animate-spin" />
                    </div>
                  ) : generatedAvatarUrl ? (
                    <img 
                      src={generatedAvatarUrl} 
                      alt="Generated Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : useRandomAvatar ? (
                    <div className="flex items-center justify-center w-full h-full bg-blue-100 dark:bg-blue-900">
                      <RefreshCw className="w-8 h-8 text-blue-500 dark:text-blue-200" />
                    </div>
                  ) : (
                    <span className="text-xs text-center text-muted-foreground p-2">
                      {t("language") === "ru" ? "Нажмите, чтобы загрузить аватар" : "Click to upload avatar"}
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    disabled={generatingAvatar}
                  />
                </div>
              </div>
              
              {generatingAvatar && (
                <div className="mt-2 w-full px-12">
                  <Progress value={generationProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("language") === "ru" 
                      ? `Генерация аватара: ${Math.round(generationProgress)}%` 
                      : `Generating avatar: ${Math.round(generationProgress)}%`}
                  </p>
                </div>
              )}
              
              {!generatingAvatar && (
                <div className="flex justify-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="generate-avatar"
                      checked={useRandomAvatar || !!generatedAvatarUrl}
                      onCheckedChange={() => !generatingAvatar && generateRandomAvatar()}
                      disabled={generatingAvatar}
                    />
                    <label 
                      htmlFor="generate-avatar" 
                      className="text-sm cursor-pointer"
                    >
                      {t("language") === "ru" ? "Сгенерировать" : "Generate"}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="skip-avatar"
                      checked={skipAvatar}
                      onCheckedChange={(checked) => {
                        if (checked && !generatingAvatar) {
                          setSkipAvatar(true);
                          setUseRandomAvatar(false);
                          setSelectedFile(null);
                          setGeneratedAvatarUrl(null);
                        } else {
                          setSkipAvatar(false);
                        }
                      }}
                      disabled={generatingAvatar}
                    />
                    <label 
                      htmlFor="skip-avatar" 
                      className="text-sm cursor-pointer"
                    >
                      {t("language") === "ru" ? "Без аватара" : "Skip avatar"}
                    </label>
                  </div>
                </div>
              )}
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
                placeholder={t("language") === "ru" ? "Введите имя пользователя" : "Enter username"}
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
                placeholder={t("language") === "ru" ? "Введите email" : "Enter email"}
                autoComplete="email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="projects" className="block text-sm font-medium mb-1">
                {t("language") === "ru" ? "Расскажи о своих проектах" : "Tell us about your projects"} *
              </label>
              <Textarea
                id="projects"
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                placeholder={t("language") === "ru" ? "Расскажите о проектах, над которыми вы работали" : "Tell us about projects you've worked on"}
                rows={3}
                required
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
              <label className="block text-sm font-medium mb-1">
                {t("language") === "ru" ? "Языки программирования" : "Programming Languages"} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                {programmingLanguages.map(language => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`lang-${language}`}
                      checked={selectedLanguages.includes(language)}
                      onCheckedChange={() => handleLanguageToggle(language)}
                    />
                    <label 
                      htmlFor={`lang-${language}`} 
                      className="text-sm cursor-pointer"
                    >
                      {language}
                    </label>
                  </div>
                ))}
              </div>
              {selectedLanguages.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t("language") === "ru" 
                    ? `Выбрано: ${selectedLanguages.length}` 
                    : `Selected: ${selectedLanguages.length}`}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium mb-1">
                {t("experience")} *
              </label>
              <Select value={experience} onValueChange={setExperience} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("language") === "ru" ? "Выберите опыт работы" : "Select work experience"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 {t("language") === "ru" ? "лет" : "years"}</SelectItem>
                  <SelectItem value="1-3">1-3 {t("language") === "ru" ? "лет" : "years"}</SelectItem>
                  <SelectItem value="3-5">3-5 {t("language") === "ru" ? "лет" : "years"}</SelectItem>
                  <SelectItem value="5+">5+ {t("language") === "ru" ? "лет" : "years"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="itPosition" className="block text-sm font-medium mb-1">
                {t("language") === "ru" ? "Какую позицию в IT занимаешь?" : "What IT position do you hold?"} *
              </label>
              <Textarea
                id="itPosition"
                value={itPosition}
                onChange={(e) => setITPosition(e.target.value)}
                placeholder={t("language") === "ru" ? "Опишите вашу текущую или желаемую IT позицию" : "Describe your current or desired IT position"}
                rows={2}
                required
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
                placeholder={t("language") === "ru" ? "Введите пароль" : "Enter password"}
                autoComplete="new-password"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                {t("language") === "ru" ? "Подтверждение пароля" : "Confirm Password"} *
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("language") === "ru" ? "Подтвердите пароль" : "Confirm password"}
                autoComplete="new-password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={isLoading || generatingAvatar}>
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
            
            <p className="text-xs text-muted-foreground text-center">
              * {t("requiredFields")}
            </p>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("language") === "ru" ? "Уже есть аккаунт? " : "Already have an account? "}
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
