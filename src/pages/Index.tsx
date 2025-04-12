
import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DeveloperCard from "../components/DeveloperCard";
import { Navigate, useNavigate } from "react-router-dom";

const Index = () => {
  const { t } = useTranslation();
  const { users, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Show all users
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (u) =>
          (u.username.toLowerCase().includes(query) ||
            (u.skills && Array.isArray(u.skills) && u.skills.some(skill => skill.toLowerCase().includes(query))) ||
            (u.itPosition && u.itPosition.toLowerCase().includes(query)) ||
            (u.languages && Array.isArray(u.languages) && u.languages.some(lang => lang.toLowerCase().includes(query))))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("language") === "ru" ? "Разработчики" : "Developers"}</h1>
      
      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder={t("language") === "ru" ? "Поиск по имени, языкам программирования или должности" : "Search by name, programming languages or position"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((developer) => (
            <DeveloperCard key={developer.id} developer={developer} />
          ))
        ) : (
          <div className="col-span-2 text-center py-8">
            {t("language") === "ru" 
              ? "Разработчиков не найдено" 
              : "No developers found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
