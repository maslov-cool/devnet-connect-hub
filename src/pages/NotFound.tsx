
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../hooks/useTranslation";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center px-6">
        <h1 className="text-7xl font-bold text-brand-DEFAULT mb-4">404</h1>
        <p className="text-2xl mb-8">
          {t("language") === "ru" 
            ? "Упс! Страница не найдена"
            : "Oops! Page not found"
          }
        </p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {t("language") === "ru" 
            ? "Страница, которую вы ищете, не существует или была перемещена"
            : "The page you are looking for doesn't exist or has been moved"
          }
        </p>
        <Button asChild>
          <Link to="/">
            {t("language") === "ru" 
              ? "Вернуться на главную"
              : "Return to Home"
            }
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
