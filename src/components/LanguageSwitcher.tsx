
import { Button } from "@/components/ui/button";
import { useTranslation } from "../hooks/useTranslation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-[1.2rem] w-[1.2rem] text-blue-900 dark:text-blue-300" />
          <span className="hidden sm:inline-block text-sm font-medium text-blue-900 dark:text-blue-300">
            {language === "ru" ? "RU" : "EN"}
          </span>
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage("ru")} 
          className={language === "ru" ? "bg-blue-900/10 dark:bg-blue-900/20" : ""}
        >
          Русский
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage("en")} 
          className={language === "en" ? "bg-blue-900/10 dark:bg-blue-900/20" : ""}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
