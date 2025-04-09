
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus } from "lucide-react";

const MessagesPage = () => {
  const { user, users, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users.filter(u => u.id !== user?.id));

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Filter out current user and apply search
    const filtered = users.filter(u => {
      if (u.id === user?.id) return false;
      
      if (searchQuery.trim() === "") {
        return true;
      }
      
      const query = searchQuery.toLowerCase();
      return u.username.toLowerCase().includes(query);
    });
    
    setFilteredUsers(filtered);
  }, [users, user, searchQuery, isAuthenticated, navigate]);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t("messages")}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="bg-card rounded-lg border shadow-sm p-4 md:col-span-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder={t("searchDialogs")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="space-y-2">
            {filteredUsers.map((chatUser) => (
              <Link 
                key={chatUser.id} 
                to={`/messages/${chatUser.id}`} 
                className="flex items-center gap-3 p-3 rounded-md hover:bg-accent"
              >
                <Avatar>
                  <AvatarImage src={chatUser.avatar} alt={chatUser.username} />
                  <AvatarFallback>{chatUser.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{chatUser.username}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">9 Apr</p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chatUser.id === "1" ? "1.py" : t("language") === "ru" ? "Привет!" : "Hello!"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Empty state */}
        <div className="bg-card rounded-lg border shadow-sm p-6 flex items-center justify-center md:col-span-2">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">{t("newMessage")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("language") === "ru" 
                ? "Выберите контакт из списка слева, чтобы начать беседу" 
                : "Select a contact from the list on the left to start a conversation"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
