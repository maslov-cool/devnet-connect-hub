
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Github } from "lucide-react";
import { toast } from "sonner";

interface Creator {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  link?: string;
  linkType?: "github" | "telegram";
}

const AboutCreatorsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [editData, setEditData] = useState<Partial<Creator>>({});

  const [creators, setCreators] = useState<Creator[]>([
    {
      id: "1",
      name: "Зорин Илья",
      role: t("projectFounder"),
      description: "Разработчик и основатель DevNet. Специалист в области web-разработки и построения сообществ разработчиков.",
      image: "/lovable-uploads/a5c8f24b-7c7c-491f-8c25-b774ac29eea0.png",
      link: "https://github.com/ilazorin",
      linkType: "github"
    },
    {
      id: "2",
      name: "Маслов Александр",
      role: t("leadDeveloper"),
      description: "Отвечает за техническую часть проекта и развитие платформы. Специализируется на React и современных веб-технологиях.",
      image: "/lovable-uploads/aa55c4d6-39cd-44b9-a4f9-1591e7ccac49.png",
      link: "https://t.me/ten-fun",
      linkType: "telegram"
    }
  ]);

  const allowedUsers = [
    { username: "ilazorin", password: "243546" },
    { username: "ten-fun", password: "190324" }
  ];

  const handleLogin = () => {
    const found = allowedUsers.find(
      u => u.username === loginUsername && u.password === loginPassword
    );

    if (found) {
      setIsEditing(true);
      toast.success(t("language") === "ru" ? "Доступ предоставлен" : "Access granted");
    } else {
      toast.error(t("language") === "ru" ? "Неверные учетные данные" : "Invalid credentials");
    }
  };

  const handleEditCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setEditData({
      name: creator.name,
      role: creator.role,
      description: creator.description,
      image: creator.image,
      link: creator.link
    });
  };

  const handleSaveEdit = () => {
    if (!selectedCreator) return;
    
    setCreators(
      creators.map(c => 
        c.id === selectedCreator.id 
          ? { ...c, ...editData } 
          : c
      )
    );
    
    setSelectedCreator(null);
    toast.success(t("language") === "ru" ? "Информация обновлена" : "Information updated");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditData({ ...editData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold text-center mb-2">{t("aboutCreators")}</h1>
      <p className="text-center text-muted-foreground mb-12">{t("meetTheTeam")}</p>

      <div className="grid md:grid-cols-2 gap-8">
        {creators.map((creator) => (
          <div key={creator.id} className="bg-card border rounded-lg p-6 relative">
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => handleEditCreator(creator)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <img 
                  src={creator.image} 
                  alt={creator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold">{creator.name}</h2>
              <p className="text-brand-DEFAULT mb-2">{creator.role}</p>
              <p className="text-center text-muted-foreground mb-4">{creator.description}</p>
              
              {creator.link && (
                <a 
                  href={creator.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-brand-DEFAULT hover:underline"
                >
                  {creator.linkType === "github" ? (
                    <>
                      <Github className="h-4 w-4 mr-1" />
                      GitHub
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.11-.06-.16-.07-.05-.18-.03-.25-.02-.11.03-1.86 1.18-5.25 3.47-.5.34-.95.51-1.36.5-.45-.01-1.3-.25-1.94-.46-.78-.26-1.4-.4-1.34-.85.03-.22.32-.46.87-.7C7.94 11.71 9.83 11 12.53 9.84c2.02-.86 4.35-1.9 4.35-1.9.48-.19.83-.29 1.38-.29.17 0 .52.05.64.27.08.15.1.35.07.88z"/>
                      </svg>
                      Telegram
                    </>
                  )}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin login dialog */}
      {!isEditing && (
        <div className="mt-12 text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                {t("language") === "ru" ? "Редактировать информацию" : "Edit Information"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("language") === "ru" 
                    ? "Вход для редактирования" 
                    : "Login to Edit"
                  }
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="username">{t("username")}</Label>
                  <Input
                    id="username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" onClick={handleLogin}>
                  {t("login")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Edit creator dialog */}
      <Dialog
        open={!!selectedCreator}
        onOpenChange={(open) => !open && setSelectedCreator(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("language") === "ru" ? "Редактировать информацию" : "Edit Information"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden relative">
                <img 
                  src={editData.image || selectedCreator?.image} 
                  alt="Creator" 
                  className="w-full h-full object-cover"
                />
                <label 
                  htmlFor="creator-image" 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                >
                  {t("uploadFromDevice")}
                </label>
                <input 
                  id="creator-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                value={editData.name || ""}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="role">{t("role")}</Label>
              <Input
                id="role"
                value={editData.role || ""}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                value={editData.description || ""}
                rows={3}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="link">{t("link")}</Label>
              <Input
                id="link"
                value={editData.link || ""}
                onChange={(e) => setEditData({ ...editData, link: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSelectedCreator(null)}>
              {t("cancel")}
            </Button>
            <Button type="button" onClick={handleSaveEdit}>
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutCreatorsPage;
