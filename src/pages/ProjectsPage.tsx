
import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  technologies: string[];
  created: string;
}

const ProjectsPage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "DevNet",
      description: "Профессиональная сеть для разработчиков",
      owner: "1",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      created: "2025-04-09T15:00:00"
    }
  ]);
  
  const filteredProjects = projects.filter(project => {
    if (searchQuery.trim() === "") {
      return true;
    }
    
    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query))
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">{t("projects")}</h1>
        
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[250px]"
            />
          </div>
          
          {isAuthenticated && (
            <Button onClick={() => navigate("/create-project")}>
              <Plus className="h-4 w-4 mr-2" />
              {t("createProject")}
            </Button>
          )}
        </div>
      </div>
      
      {isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{project.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("language") === "ru" ? "Создан" : "Created"}: {" "}
                  {new Date(project.created).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/projects/${project.id}`}>
                    {t("language") === "ru" ? "Подробнее" : "View Details"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {t("language") === "ru" 
                  ? "Проекты не найдены" 
                  : "No projects found"
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-medium mb-4">
            {t("language") === "ru" 
              ? "Войдите, чтобы просматривать проекты"
              : "Log in to view projects"
            }
          </h2>
          <Link to="/login">
            <Button className="mr-4">{t("login")}</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline">{t("register")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
