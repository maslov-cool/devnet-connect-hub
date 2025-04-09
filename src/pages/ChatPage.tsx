
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip, Smile } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  file?: {
    name: string;
    url: string;
  };
}

const ChatPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, users, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [chatUser, setChatUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample messages for demo purposes
  const demoMessages1: Message[] = [
    {
      id: "1",
      sender: "1",
      content: "Привет",
      timestamp: new Date("2025-04-09T15:24:00")
    },
    {
      id: "2",
      sender: "1",
      content: "😃приверрр",
      timestamp: new Date("2025-04-09T15:24:00")
    },
    {
      id: "3",
      sender: "1",
      file: {
        name: "1.png",
        url: "/lovable-uploads/33d8adec-dc34-48bb-893c-a7647f8d1abf.png"
      },
      content: "",
      timestamp: new Date("2025-04-09T15:25:00")
    }
  ];
  
  const demoMessages2: Message[] = [
    {
      id: "1",
      sender: "2",
      content: "Hey there!",
      timestamp: new Date("2025-04-09T15:24:00")
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setChatUser(foundUser);
      
      // Set demo messages based on user ID
      if (foundUser.id === "1") {
        setMessages(demoMessages1);
      } else if (foundUser.id === "2") {
        setMessages(demoMessages2);
      }
    } else {
      navigate("/messages");
    }
  }, [userId, users, isAuthenticated, navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if ((!newMessage.trim() && !file) || !user) return;
    
    const newMsg: Message = {
      id: (messages.length + 1).toString(),
      sender: user.id,
      content: newMessage,
      timestamp: new Date(),
    };
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newMsg.file = {
            name: file.name,
            url: URL.createObjectURL(file)
          };
          setMessages([...messages, newMsg]);
          setNewMessage("");
          setFile(null);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.info(`${t("language") === "ru" ? "Файл выбран" : "File selected"}: ${selectedFile.name}`);
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (!chatUser) return null;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="bg-card rounded-lg border shadow-sm flex flex-col h-[80vh]">
        {/* Chat header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/messages" className="md:hidden">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Avatar>
              <AvatarImage src={chatUser.avatar} />
              <AvatarFallback>{chatUser.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{chatUser.username}</p>
              <p className="text-xs text-muted-foreground">{t("online")}</p>
            </div>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.sender === user?.id;
              
              return (
                <div 
                  key={message.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isOwnMessage 
                        ? "bg-brand-DEFAULT text-white rounded-br-none" 
                        : "bg-muted rounded-bl-none"
                    }`}
                  >
                    {message.content && <p>{message.content}</p>}
                    
                    {message.file && (
                      <div className="mt-2">
                        <div className="bg-white bg-opacity-10 rounded p-2 flex items-center">
                          <img 
                            src={message.file.url} 
                            alt={message.file.name} 
                            className="max-w-full max-h-60 rounded" 
                          />
                        </div>
                        <p className="text-xs mt-1 opacity-70">{message.file.name}</p>
                      </div>
                    )}
                    
                    <p className={`text-xs mt-1 ${isOwnMessage ? "text-white/70" : "text-muted-foreground"}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleOpenFileDialog}
            >
              <Paperclip className="h-5 w-5" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </Button>
            
            <Input
              placeholder={t("typeMessage")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            
            <Button
              type="button"
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && !file}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          {file && (
            <div className="mt-2 p-2 bg-muted rounded flex items-center justify-between">
              <span className="text-sm truncate">{file.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFile(null)}
              >
                &times;
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
