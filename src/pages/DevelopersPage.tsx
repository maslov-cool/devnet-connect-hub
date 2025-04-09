
import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeveloperCard from '../components/DeveloperCard';

const DevelopersPage = () => {
  const { t } = useTranslation();
  const { users, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(query) ||
        (user.skills && user.skills.some(skill => 
          skill.toLowerCase().includes(query)
        ))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("developers")}</h1>
      
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
          {filteredUsers.map((user) => (
            <DeveloperCard key={user.id} developer={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-medium mb-4">
            {t("language") === "ru" 
              ? "Войдите, чтобы просматривать разработчиков"
              : "Log in to view developers"
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

export default DevelopersPage;
