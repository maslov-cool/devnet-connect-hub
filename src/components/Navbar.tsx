
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-brand-DEFAULT text-white w-10 h-10 rounded flex items-center justify-center text-xl font-bold">
              D
            </div>
            <span className="text-xl font-bold">DevNet</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-brand-DEFAULT transition-colors">
            {t("home")}
          </Link>
          <Link to="/messages" className="font-medium hover:text-brand-DEFAULT transition-colors">
            {t("messages")}
          </Link>
          <Link to="/about" className="font-medium hover:text-brand-DEFAULT transition-colors">
            {t("aboutCreators")}
          </Link>
          <Link to="/for-developers" className="font-medium hover:text-brand-DEFAULT transition-colors">
            {t("forDevelopers")}
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={user.avatar || ""} alt={user.username} />
                    <AvatarFallback>{user.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/profile/${user.id}`} className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("profile")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("settings")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="default">{t("login")}</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
