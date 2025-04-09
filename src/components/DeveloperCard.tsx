
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare } from "lucide-react";

interface Developer {
  id: string;
  username: string;
  avatar?: string;
  skills?: string[];
  currentlyStudying?: string[];
  experience?: string;
}

interface DeveloperCardProps {
  developer: Developer;
}

const DeveloperCard = ({ developer }: DeveloperCardProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-card border rounded-lg p-6 flex flex-col md:flex-row gap-6 shadow-sm">
      <div className="flex justify-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={developer.avatar} alt={developer.username} />
          <AvatarFallback className="text-xl">
            {developer.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-xl font-bold">{developer.username}</h2>
        
        <div className="mt-2">
          {developer.experience && (
            <div className="text-sm text-muted-foreground">
              {t("experience")}: {developer.experience} {t("yearsExperience")}
            </div>
          )}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1 justify-center md:justify-start">
          {developer.skills && developer.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        
        {developer.currentlyStudying && developer.currentlyStudying.length > 0 && (
          <div className="mt-2">
            <span className="text-sm font-medium">{t("currentlyStudying")}:</span>
            <div className="flex flex-wrap gap-1 mt-1 justify-center md:justify-start">
              {developer.currentlyStudying.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
          <Button asChild size="sm">
            <Link to={`/messages/${developer.id}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              {t("write")}
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="sm">
            <Link to={`/profile/${developer.id}`}>{t("fullProfile")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
