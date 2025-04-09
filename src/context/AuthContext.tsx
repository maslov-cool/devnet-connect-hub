
import React, { createContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Пустой массив пользователей для инициализации
const sampleUsers: any[] = [];

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  skills?: string[];
  currentlyStudying?: string[];
  experience?: string;
  specialization?: string;
  registrationDate: string;
  aboutMe?: string;
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
  forgotPassword: (email: string) => Promise<boolean>;
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
  forgotPassword: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Инициализация с пустым массивом пользователей
    setUsers(sampleUsers);

    // Проверка, авторизован ли пользователь из localStorage
    const storedUser = localStorage.getItem("devnet_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("devnet_user");
      }
    }
  }, []);

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
        return false;
      }

      // Создание нового пользователя
      const newUser = {
        id: (users.length + 1).toString(),
        username,
        email,
        password,
        registrationDate: new Date().toISOString().split("T")[0],
        ...profileData,
      };

      // Добавление в список пользователей
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Автоматический вход
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("devnet_user", JSON.stringify(newUser));

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

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // В реальном приложении здесь должна быть логика отправки email для сброса пароля
      // Для демонстрации просто проверяем, существует ли пользователь с таким email
      const foundUser = users.find((u) => u.email === email);
      
      if (foundUser) {
        console.log(`Сброс пароля для email: ${email}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Forgot password error:", error);
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
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
