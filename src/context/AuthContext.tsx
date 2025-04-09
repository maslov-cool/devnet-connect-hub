
import React, { createContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  experience?: string;
  skills?: string[];
  currentlyStudying?: string[];
  registrationDate?: string;
}

const demoUsers = [
  {
    id: "1",
    username: "ilazorin",
    email: "ilazorin@example.com",
    password: "243546",
    avatar: "/lovable-uploads/71218a01-a00f-4c50-b88e-5016985aa63f.png",
    experience: "1-3",
    skills: ["React", "JavaScript"],
    currentlyStudying: ["TypeScript"],
    registrationDate: "2025-04-09T15:22:00",
    telegram: "1"
  },
  {
    id: "2",
    username: "ten-fun",
    email: "ten-fun@example.com",
    password: "190324",
    avatar: "/lovable-uploads/8b525698-42d6-4328-b8c5-99fb4df89298.png",
    experience: "5+",
    skills: ["Python", "Flask"],
    currentlyStudying: ["React"],
    registrationDate: "2025-04-09T15:23:00",
    telegram: "1"
  }
];

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  users: [],
  login: async () => false,
  logout: () => {},
  register: async () => false,
  forgotPassword: async () => false,
  isAuthenticated: false,
  updateUser: () => {}
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<any[]>(demoUsers);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = demoUsers.find(
      user => user.username === username && user.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success("Успешный вход в систему!");
      return true;
    }
    
    toast.error("Неверное имя пользователя или пароль");
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Вы вышли из системы");
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    const userExists = users.some(u => u.username === username || u.email === email);
    
    if (userExists) {
      toast.error("Пользователь с таким именем или email уже существует");
      return false;
    }
    
    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      username,
      email,
      password,
      registrationDate: new Date().toISOString(),
      experience: "0-1",
      skills: [],
      currentlyStudying: [],
      telegram: username
    };
    
    // Update users array
    setUsers([...users, newUser]);
    
    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    toast.success("Регистрация успешна!");
    return true;
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    const userExists = users.some(u => u.email === email);
    
    if (!userExists) {
      toast.error("Пользователь с таким email не найден");
      return false;
    }
    
    toast.success("Ссылка для сброса пароля отправлена на ваш email");
    return true;
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in users array as well
    setUsers(users.map(u => u.id === user.id ? { ...u, ...userData } : u));
    
    toast.success("Профиль обновлен");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        users, 
        login, 
        logout, 
        register, 
        forgotPassword, 
        isAuthenticated,
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
