
import React, { createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useEmailService } from "../hooks/useEmailService";

// Пустой массив пользователей для инициализации
const sampleUsers: any[] = [];

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  skills?: string[];
  languages?: string[];
  currentlyStudying?: string[];
  experience?: string;
  itPosition?: string;
  registrationDate: string;
  projects?: string;
  telegramLink?: string;
  githubLink?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, profileData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: any) => void;
  deleteAccount: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  users: [],
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUser: () => {},
  deleteAccount: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { sendEmail } = useEmailService();

  // Загрузка пользователей из localStorage при инициализации
  useEffect(() => {
    const storedUser = localStorage.getItem("devnet_user");
    const storedUsers = localStorage.getItem("devnet_users");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("devnet_user");
      }
    }
    
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Failed to parse stored users:", error);
        localStorage.setItem("devnet_users", JSON.stringify([]));
      }
    } else {
      localStorage.setItem("devnet_users", JSON.stringify([]));
    }
  }, []);

  // Сохранение пользователей в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("devnet_users", JSON.stringify(users));
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Найти пользователя с соответствующим email и паролем
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("devnet_user", JSON.stringify(foundUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    username: string, 
    email: string, 
    password: string, 
    profileData: any
  ): Promise<boolean> => {
    try {
      // Проверка, существует ли пользователь с таким email
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        toast.error("Пользователь с таким email уже существует");
        return false;
      }

      // Определение аватара
      let avatarUrl = "";
      if (profileData.generatedAvatarUrl) {
        avatarUrl = profileData.generatedAvatarUrl;
      }

      // Создание нового пользователя
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        registrationDate: profileData.registrationDate || new Date().toISOString().split("T")[0],
        telegramLink: profileData.telegramLink || "",
        githubLink: profileData.githubLink || "",
        languages: profileData.languages || [],
        experience: profileData.experience || "0-1",
        itPosition: profileData.itPosition || "",
        projects: profileData.projects || "",
        avatar: avatarUrl || "",
      };

      // Добавляем пользователя в основной список
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("devnet_user");
  };

  const updateUser = (userData: any) => {
    // Обновление текущего пользователя
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser as User);
    localStorage.setItem("devnet_user", JSON.stringify(updatedUser));

    // Обновление в списке пользователей
    const updatedUsers = users.map((u) =>
      u.id === user?.id ? updatedUser : u
    );
    setUsers(updatedUsers as User[]);
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user) return false;

      // Удаление пользователя из списка
      const updatedUsers = users.filter((u) => u.id !== user.id);
      setUsers(updatedUsers);
      
      // Выход из системы
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("devnet_user");

      return true;
    } catch (error) {
      console.error("Delete account error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
