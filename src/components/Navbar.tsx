
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
import { 
  LogOut, 
  User, 
  Settings, 
  Menu, 
  X 
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-900 text-white w-10 h-10 rounded flex items-center justify-center text-xl font-bold">
              D
            </div>
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            {t("home")}
          </Link>
          <Link to="/messages" className="font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            {t("messages")}
          </Link>
          <Link to="/about" className="font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            {t("aboutCreators")}
          </Link>
          <Link to="/for-developers" className="font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            {t("forDevelopers")}
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-blue-900 dark:text-blue-300" />
            ) : (
              <Menu className="h-6 w-6 text-blue-900 dark:text-blue-300" />
            )}
          </Button>
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
              <Button variant="default" className="bg-blue-900 hover:bg-blue-800">{t("login")}</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 py-3 space-y-2 bg-background border-b">
            <Link 
              to="/" 
              className="block py-2 font-medium hover:text-blue-800 dark:hover:text-blue-300"
              onClick={toggleMobileMenu}
            >
              {t("home")}
            </Link>
            <Link 
              to="/messages" 
              className="block py-2 font-medium hover:text-blue-800 dark:hover:text-blue-300"
              onClick={toggleMobileMenu}
            >
              {t("messages")}
            </Link>
            <Link 
              to="/about" 
              className="block py-2 font-medium hover:text-blue-800 dark:hover:text-blue-300"
              onClick={toggleMobileMenu}
            >
              {t("aboutCreators")}
            </Link>
            <Link 
              to="/for-developers" 
              className="block py-2 font-medium hover:text-blue-800 dark:hover:text-blue-300"
              onClick={toggleMobileMenu}
            >
              {t("forDevelopers")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
