
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DeveloperCard from "../components/DeveloperCard";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, users, user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users.filter(u => u.id !== user?.id));

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users.filter(u => u.id !== user?.id));
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (u) =>
          u.id !== user?.id &&
          (u.username.toLowerCase().includes(query) ||
            (u.skills && u.skills.some((skill) => skill.toLowerCase().includes(query))))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users, user]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-DEFAULT to-brand-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">DevNet</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            {t("language") === "ru" 
              ? "Профессиональная сеть для разработчиков, где вы можете делиться опытом, находить проекты и общаться с единомышленниками."
              : "A professional network for developers where you can share experience, find projects, and connect with like-minded people."
            }
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!isAuthenticated && (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/register")} 
                  className="bg-white text-brand-DEFAULT hover:bg-gray-100 hover:text-brand-dark"
                >
                  {t("register")}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/login")} 
                  className="border-white text-white hover:bg-white/10"
                >
                  {t("login")}
                </Button>
              </>
            )}
            {isAuthenticated && (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/profile/" + user?.id)} 
                  className="bg-white text-brand-DEFAULT hover:bg-gray-100 hover:text-brand-dark"
                >
                  {t("profile")}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/messages")} 
                  className="border-white text-white hover:bg-white/10"
                >
                  {t("messages")}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {t("language") === "ru" ? "Возможности DevNet" : "DevNet Features"}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card shadow-md rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {t("language") === "ru" ? "Сообщество разработчиков" : "Developer Community"}
              </h3>
              <p className="text-muted-foreground">
                {t("language") === "ru" 
                  ? "Находите коллег, общайтесь и обменивайтесь опытом с разработчиками со всего мира."
                  : "Find colleagues, communicate and exchange experience with developers from around the world."
                }
              </p>
            </div>
            
            <div className="bg-card shadow-md rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {t("language") === "ru" ? "Профессиональные профили" : "Professional Profiles"}
              </h3>
              <p className="text-muted-foreground">
                {t("language") === "ru" 
                  ? "Создавайте детальные профили с информацией о ваших навыках, опыте и контактах."
                  : "Create detailed profiles with information about your skills, experience, and contacts."
                }
              </p>
            </div>
            
            <div className="bg-card shadow-md rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-DEFAULT" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {t("language") === "ru" ? "Обмен сообщениями" : "Messaging"}
              </h3>
              <p className="text-muted-foreground">
                {t("language") === "ru" 
                  ? "Общайтесь напрямую с другими разработчиками, отправляйте файлы и работайте вместе."
                  : "Communicate directly with other developers, send files and work together."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-foreground">{t("developers")}</h2>
          
          <div className="mb-8 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder={t("searchByName")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {isAuthenticated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUsers.map((developer) => (
                <DeveloperCard key={developer.id} developer={developer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-medium mb-4 text-foreground">
                {t("language") === "ru" 
                  ? "Войдите, чтобы просматривать разработчиков"
                  : "Log in to view developers"
                }
              </h2>
              <Button 
                className="mr-4 bg-blue-900 hover:bg-blue-800"
                onClick={() => navigate("/login")}
              >
                {t("login")}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/register")}
              >
                {t("register")}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            {t("language") === "ru" ? "Присоединяйтесь к DevNet сегодня" : "Join DevNet Today"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            {t("language") === "ru" 
              ? "Станьте частью растущего сообщества профессиональных разработчиков. Создайте свой профиль, поделитесь опытом и найдите единомышленников!"
              : "Become part of a growing community of professional developers. Create your profile, share your experience and find like-minded people!"
            }
          </p>
          {!isAuthenticated && (
            <Button 
              size="lg" 
              onClick={() => navigate("/register")} 
              className="bg-brand-DEFAULT hover:bg-brand-dark text-white"
            >
              {t("register")}
            </Button>
          )}
          {isAuthenticated && (
            <Button 
              size="lg" 
              onClick={() => navigate("/messages")} 
              className="bg-brand-DEFAULT hover:bg-brand-dark text-white"
            >
              {t("messages")}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
