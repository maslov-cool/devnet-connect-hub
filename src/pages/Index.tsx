
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
    <div className="container mx-auto px-4 py-8">
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
  );
};

export default Index;
