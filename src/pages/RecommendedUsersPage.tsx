
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { toast } from "sonner";
import DeveloperCard from "../components/DeveloperCard";

const RecommendedUsersPage = () => {
  const { users, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [recommendedUsers, setRecommendedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!user) {
      navigate("/login");
      return;
    }

    // Получаем рекомендованных пользователей на основе выбранных языков/позиции текущего пользователя
    const filterUsersByPreference = () => {
      setLoading(true);
      
      if (!user || !user.skills || !users) {
        setRecommendedUsers([]);
        setLoading(false);
        return;
      }

      try {
        // Фильтруем пользователей, которые имеют общие навыки с текущим пользователем
        const filteredUsers = users.filter(u => {
          // Исключаем текущего пользователя
          if (u.id === user.id) return false;
          
          // Проверяем совпадения по навыкам
          if (!u.skills || !Array.isArray(u.skills)) return false;
          
          // Ищем совпадения по языкам программирования
          const hasCommonSkill = u.skills.some((skill: string) => 
            user.skills && Array.isArray(user.skills) && user.skills.includes(skill)
          );
          
          return hasCommonSkill;
        });
        
        setRecommendedUsers(filteredUsers);
      } catch (error) {
        console.error("Ошибка при фильтрации пользователей:", error);
        toast.error(t("language") === "ru" 
          ? "Ошибка при загрузке рекомендаций" 
          : "Error loading recommendations");
      } finally {
        setLoading(false);
      }
    };

    filterUsersByPreference();
  }, [user, users, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-xl font-semibold">
            {t("language") === "ru" ? "Загрузка рекомендаций..." : "Loading recommendations..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle>
            {t("language") === "ru" ? "Рекомендуемые разработчики" : "Recommended Developers"}
          </CardTitle>
          <p className="text-muted-foreground">
            {t("language") === "ru" 
              ? "Разработчики с похожими навыками и интересами" 
              : "Developers with similar skills and interests"}
          </p>
        </CardHeader>
        <CardContent>
          {recommendedUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedUsers.map((developer) => (
                <DeveloperCard key={developer.id} developer={developer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl font-semibold mb-2">
                {t("language") === "ru" 
                  ? "Мы не нашли подходящих разработчиков" 
                  : "We couldn't find matching developers"}
              </p>
              <p className="text-muted-foreground">
                {t("language") === "ru" 
                  ? "Попробуйте изменить свои навыки или посмотреть всех разработчиков" 
                  : "Try changing your skills or view all developers"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={() => navigate("/home")} variant="outline">
            {t("language") === "ru" ? "Посмотреть всех" : "View all developers"}
          </Button>
          <Button onClick={() => navigate("/settings")} variant="default">
            {t("language") === "ru" ? "Изменить мой профиль" : "Update my profile"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecommendedUsersPage;
