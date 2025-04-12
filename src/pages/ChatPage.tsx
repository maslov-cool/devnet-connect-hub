
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { useNotification } from "../hooks/useNotification";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip, Smile, Download, FileText, File } from "lucide-react";
import { toast } from "sonner";
import EmojiPicker from "./EmojiPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
  file?: {
    name: string;
    url: string;
    type?: string;
    caption?: string;
  };
}

// Function to get chat messages from localStorage
const getMessagesFromStorage = (conversationKey: string): Message[] => {
  try {
    const savedMessages = localStorage.getItem(`chat_${conversationKey}`);
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
  } catch (error) {
    console.error("Error retrieving messages from localStorage:", error);
  }
  return [];
};

// Function to save chat messages to localStorage
const saveMessagesToStorage = (conversationKey: string, messages: Message[]): void => {
  try {
    localStorage.setItem(`chat_${conversationKey}`, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to localStorage:", error);
  }
};

const ChatPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, users, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { newMessageNotification } = useNotification();
  
  const [chatUser, setChatUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileCaption, setFileCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<Message["file"] | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationKey, setConversationKey] = useState<string>("");

  // Initialize or get existing messages from local storage
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Find the selected user
    const foundUser = users.find(u => u.id === userId);
    if (foundUser && user) {
      setChatUser(foundUser);
      
      // Create a consistent conversation key that works regardless of who initiated the conversation
      const newConversationKey = [user.id, foundUser.id].sort().join('-');
      setConversationKey(newConversationKey);
      
      // Load messages from localStorage
      const loadedMessages = getMessagesFromStorage(newConversationKey);
      setMessages(loadedMessages);
    } else {
      navigate("/messages");
    }
  }, [userId, users, isAuthenticated, navigate, user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (conversationKey && messages.length > 0) {
      saveMessagesToStorage(conversationKey, messages);
    }
  }, [messages, conversationKey]);

  const handleSendMessage = () => {
    if ((!newMessage.trim() && !file) || !user || !userId) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: user.id,
      receiver: userId,
      content: newMessage,
      timestamp: new Date(),
    };
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Create object URL for the file
        const url = URL.createObjectURL(file);
        newMsg.file = {
          name: file.name,
          url: url,
          type: file.type,
          caption: fileCaption.trim() ? fileCaption : undefined
        };
        
        // Update messages
        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        
        // Save to localStorage
        if (conversationKey) {
          saveMessagesToStorage(conversationKey, updatedMessages);
        }
        
        // Clear form
        setNewMessage("");
        setFile(null);
        setFileCaption("");
        
        // Simulate notification for demo purposes
        if (chatUser) {
          setTimeout(() => {
            newMessageNotification(user.username, t("sentFile"));
          }, 1500);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Text-only message
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      
      // Save to localStorage
      if (conversationKey) {
        saveMessagesToStorage(conversationKey, updatedMessages);
      }
      
      setNewMessage("");
      
      // Simulate notification for demo purposes
      if (chatUser) {
        setTimeout(() => {
          newMessageNotification(user.username, newMessage);
        }, 1500);
      }
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
      toast.info(`${t("fileSelected")}: ${selectedFile.name}`);
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFilePreview = (file: Message["file"]) => {
    setPreviewFile(file);
    setFilePreviewOpen(true);
  };

  const handleFileDownload = (file: Message["file"]) => {
    if (!file || !file.url) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File size={16} />;
    
    if (fileType.startsWith('image/')) {
      return null; // Images will be displayed directly
    } else if (fileType.startsWith('video/')) {
      return <FileText size={16} />;
    } else if (fileType.startsWith('audio/')) {
      return <FileText size={16} />;
    } else if (fileType.startsWith('application/pdf')) {
      return <FileText size={16} />;
    }
    
    // Default file icon for other types
    return <File size={16} />;
  };

  if (!chatUser) return null;

  const filteredUsers = users.filter(u => u.id !== user?.id);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chats sidebar - always visible on desktop, conditionally on mobile */}
        <div className="bg-card rounded-lg border shadow-sm p-4 md:col-span-1">
          <div className="space-y-2">
            {filteredUsers.map((chatUser) => (
              <Link
                key={chatUser.id}
                to={`/messages/${chatUser.id}`}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-accent w-full text-left"
              >
                <Avatar>
                  <AvatarImage src={chatUser.avatar} alt={chatUser.username} />
                  <AvatarFallback>{chatUser.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{chatUser.username}</p>
                    {/* Show last message date if there's any message */}
                    {user && (() => {
                      const conversationKey = [user.id, chatUser.id].sort().join('-');
                      const savedMessages = localStorage.getItem(`chat_${conversationKey}`);
                      if (savedMessages) {
                        const parsedMessages = JSON.parse(savedMessages);
                        if (parsedMessages.length > 0) {
                          const lastMsg = parsedMessages[parsedMessages.length - 1];
                          return (
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(lastMsg.timestamp).toLocaleDateString()}
                            </p>
                          );
                        }
                      }
                      return null;
                    })()}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {user && (() => {
                      const conversationKey = [user.id, chatUser.id].sort().join('-');
                      const savedMessages = localStorage.getItem(`chat_${conversationKey}`);
                      if (savedMessages) {
                        const parsedMessages = JSON.parse(savedMessages);
                        if (parsedMessages.length > 0) {
                          const lastMsg = parsedMessages[parsedMessages.length - 1];
                          return lastMsg.content || (lastMsg.file ? "🖼️" : "");
                        }
                      }
                      return "";
                    })()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-card rounded-lg border shadow-sm flex flex-col h-[80vh] md:col-span-2">
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
                <p className="text-xs text-muted-foreground">{Math.random() > 0.5 ? t("online") : t("wasRecently")}</p>
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
                          ? "bg-blue-900 text-white rounded-br-none" 
                          : "bg-muted rounded-bl-none"
                      }`}
                    >
                      {message.content && <p>{message.content}</p>}
                      
                      {message.file && (
                        <div className="mt-2">
                          <div 
                            className="bg-white bg-opacity-10 rounded p-2 flex items-center cursor-pointer"
                            onClick={() => message.file && handleFilePreview(message.file)}
                          >
                            {message.file.type?.startsWith('image/') ? (
                              <img 
                                src={message.file.url} 
                                alt={message.file.name} 
                                className="max-w-full max-h-60 rounded" 
                              />
                            ) : (
                              <div className="flex items-center space-x-2 text-sm w-full">
                                {getFileIcon(message.file.type)}
                                <span className="truncate flex-1">
                                  {message.file.name}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    message.file && handleFileDownload(message.file);
                                  }}
                                >
                                  <Download size={14} />
                                </Button>
                              </div>
                            )}
                          </div>
                          {message.file.caption && (
                            <p className="text-sm mt-1">{message.file.caption}</p>
                          )}
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
                className="flex-shrink-0"
              >
                <Paperclip className="h-5 w-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="*/*" // Accept all file types
                />
              </Button>
              
              <div className="relative flex-1">
                <Input
                  placeholder={file ? t("addCaption") : t("typeMessage")}
                  value={file ? fileCaption : newMessage}
                  onChange={(e) => file ? setFileCaption(e.target.value) : setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 pr-10"
                />
                <Button 
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-5 w-5" />
                </Button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-20">
                    <EmojiPicker onEmojiSelect={addEmoji} />
                  </div>
                )}
              </div>
              
              <Button
                type="button"
                size="icon"
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && !file}
                className="flex-shrink-0 bg-blue-900 hover:bg-blue-800"
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
      
      {/* File preview dialog */}
      <Dialog open={filePreviewOpen} onOpenChange={setFilePreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name || t("filePreview")}</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {previewFile && previewFile.type?.startsWith('image/') ? (
              <div>
                <img 
                  src={previewFile.url} 
                  alt={previewFile.name} 
                  className="max-w-full max-h-[70vh]" 
                />
                {previewFile.caption && (
                  <p className="text-center mt-2">{previewFile.caption}</p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <FileText size={64} className="mx-auto mb-4" />
                <p className="text-lg font-medium">{previewFile?.name}</p>
                {previewFile?.caption && (
                  <p className="mt-2">{previewFile.caption}</p>
                )}
              </div>
            )}
            
            <DialogFooter className="w-full mt-4">
              <Button 
                onClick={() => previewFile && handleFileDownload(previewFile)}
                className="w-full bg-blue-900 hover:bg-blue-800"
              >
                <Download className="mr-2 h-4 w-4" />
                {t("language") === "ru" ? "Скачать файл" : "Download file"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPage;
