
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CreateProjectPage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.error(t("language") === "ru" 
        ? "Войдите, чтобы создать проект" 
        : "Login to create a project"
      );
    }
  }, [isAuthenticated, navigate, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description) {
      toast.error(t("language") === "ru" 
        ? "Пожалуйста, заполните название и описание проекта" 
        : "Please fill in the project name and description"
      );
      return;
    }
    
    setIsLoading(true);
    
    // Simulate creating a project
    setTimeout(() => {
      setIsLoading(false);
      toast.success(t("language") === "ru" 
        ? "Проект успешно создан" 
        : "Project successfully created"
      );
      navigate("/projects");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">{t("createProject")}</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{t("language") === "ru" ? "Информация о проекте" : "Project Information"}</CardTitle>
            <CardDescription>
              {t("language") === "ru" 
                ? "Заполните информацию о вашем новом проекте" 
                : "Fill in information about your new project"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("projectName")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("language") === "ru" ? "Введите название проекта" : "Enter project name"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t("projectDescription")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("language") === "ru" ? "Опишите ваш проект" : "Describe your project"}
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="technologies">{t("technologies")}</Label>
              <Input
                id="technologies"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder={t("language") === "ru" ? "React, TypeScript, Node.js..." : "React, TypeScript, Node.js..."}
              />
              <p className="text-xs text-muted-foreground">
                {t("language") === "ru" 
                  ? "Разделите технологии запятыми" 
                  : "Separate technologies with commas"
                }
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/projects")}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
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
                  {t("language") === "ru" ? "Создание..." : "Creating..."}
                </span>
              ) : (
                t("createProject")
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateProjectPage;
