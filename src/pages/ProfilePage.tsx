
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, MessageSquare, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { users, user: currentUser, updateUser } = useAuth();
  const { t } = useTranslation();
  
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const foundUser = users.find(u => u.id === id);
    if (foundUser) {
      setProfileUser(foundUser);
    }
  }, [id, users]);

  const isOwnProfile = currentUser?.id === id;

  const handleEditProfile = () => {
    setEditData({
      username: profileUser.username,
      experience: profileUser.experience || "0-1",
      skills: profileUser.skills?.join(", ") || "",
      currentlyStudying: profileUser.currentlyStudying?.join(", ") || ""
    });
    setIsEditing(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveProfile = () => {
    const updatedData: any = {
      username: editData.username,
      experience: editData.experience,
      skills: editData.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
      currentlyStudying: editData.currentlyStudying.split(",").map((s: string) => s.trim()).filter(Boolean)
    };

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const avatarUrl = reader.result as string;
        updateUser({ ...updatedData, avatar: avatarUrl });
        setIsEditing(false);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      updateUser(updatedData);
      setIsEditing(false);
    }
  };

  if (!profileUser) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>{t("language") === "ru" ? "Пользователь не найден" : "User not found"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <Link to="/developers" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("back")}
        </Link>
      </div>
      
      <div className="relative mb-16 rounded-xl overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-brand-dark to-brand-DEFAULT"></div>
        <div className="absolute bottom-0 left-4 transform translate-y-1/2 flex items-end">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={profileUser.avatar} alt={profileUser.username} />
            <AvatarFallback className="text-2xl">
              {profileUser.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        {isOwnProfile && (
          <div className="absolute bottom-0 right-4 transform translate-y-1/2">
            <Button onClick={handleEditProfile}>{t("editProfile")}</Button>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{profileUser.username}</h1>
        <p className="text-sm text-muted-foreground">
          {t("registrationDate")} {new Date(profileUser.registrationDate).toLocaleDateString()}
        </p>
      </div>
      
      <Tabs defaultValue="about">
        <TabsList className="mb-8">
          <TabsTrigger value="about">{t("aboutDeveloper")}</TabsTrigger>
          <TabsTrigger value="stack">{t("technicalStack")}</TabsTrigger>
          <TabsTrigger value="experience">{t("workExperience")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">{t("experience")}</h2>
              <p className="text-3xl font-bold">{profileUser.experience || "0-1"}</p>
            </div>
            
            <div className="bg-card border shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">{t("contacts")}</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Github className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>GitHub: {profileUser.username}</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.11-.06-.16-.07-.05-.18-.03-.25-.02-.11.03-1.86 1.18-5.25 3.47-.5.34-.95.51-1.36.5-.45-.01-1.3-.25-1.94-.46-.78-.26-1.4-.4-1.34-.85.03-.22.32-.46.87-.7C7.94 11.71 9.83 11 12.53 9.84c2.02-.86 4.35-1.9 4.35-1.9.48-.19.83-.29 1.38-.29.17 0 .52.05.64.27.08.15.1.35.07.88z"/>
                  </svg>
                  <span>Telegram: {profileUser.telegram || profileUser.username}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stack">
          <div className="bg-card border shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">{t("skills")}</h2>
            <div className="flex flex-wrap gap-2">
              {profileUser.skills && profileUser.skills.length > 0 ? (
                profileUser.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">
                  {t("language") === "ru" 
                    ? "Навыки не указаны" 
                    : "No skills specified"
                  }
                </p>
              )}
            </div>
            
            <h2 className="text-lg font-medium mt-6 mb-4">{t("currentlyStudying")}</h2>
            <div className="flex flex-wrap gap-2">
              {profileUser.currentlyStudying && profileUser.currentlyStudying.length > 0 ? (
                profileUser.currentlyStudying.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">
                  {t("language") === "ru" 
                    ? "Не указано, что сейчас изучается" 
                    : "No current studies specified"
                  }
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="experience">
          <div className="bg-card border shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">{t("workExperience")}</h2>
            <p className="text-muted-foreground">
              {t("language") === "ru" 
                ? "Информация об опыте работы будет добавлена позже."
                : "Work experience information will be added later."
              }
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editProfile")}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2 flex flex-col items-center">
              <Avatar className="h-24 w-24 cursor-pointer group relative">
                <AvatarImage 
                  src={selectedFile ? URL.createObjectURL(selectedFile) : profileUser.avatar} 
                  alt={profileUser.username} 
                />
                <AvatarFallback>{profileUser.username[0].toUpperCase()}</AvatarFallback>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <span className="text-xs">{t("uploadFromDevice")}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </Avatar>
            </div>
            
            <div>
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                id="username"
                value={editData.username || ""}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="experience">{t("experience")}</Label>
              <select
                id="experience"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editData.experience || "0-1"}
                onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
              >
                <option value="0-1">0-1</option>
                <option value="1-3">1-3</option>
                <option value="3-5">3-5</option>
                <option value="5+">5+</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="skills">{t("skills")}</Label>
              <Input
                id="skills"
                value={editData.skills || ""}
                onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                placeholder={t("language") === "ru" ? "Разделите запятыми" : "Separate with commas"}
              />
            </div>
            
            <div>
              <Label htmlFor="currentlyStudying">{t("currentlyStudying")}</Label>
              <Input
                id="currentlyStudying"
                value={editData.currentlyStudying || ""}
                onChange={(e) => setEditData({ ...editData, currentlyStudying: e.target.value })}
                placeholder={t("language") === "ru" ? "Разделите запятыми" : "Separate with commas"}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveProfile}>
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
