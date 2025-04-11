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
  isEmailVerified?: boolean;
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
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string, token: string) => Promise<boolean>;
  verifyEmail: (email: string, token: string) => Promise<boolean>;
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
  resetPassword: async () => false,
  verifyEmail: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { sendEmail } = useEmailService();

  useEffect(() => {
    // Загрузка пользователей из localStorage при инициализации
    const storedUsers = localStorage.getItem("devnet_users");
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Error parsing stored users:", error);
        localStorage.setItem("devnet_users", JSON.stringify(sampleUsers));
        setUsers(sampleUsers);
      }
    } else {
      // Если нет сохраненных пользователей, инициализируем пустым массивом
      localStorage.setItem("devnet_users", JSON.stringify(sampleUsers));
      setUsers(sampleUsers);
    }

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

  // Сохранение пользователей в localStorage при изменении массива пользователей
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("devnet_users", JSON.stringify(users));
    }
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Найти пользователя с соответствующим email и паролем
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        // Проверяем, подтвержден ли email
        if (foundUser.isEmailVerified === false) {
          toast.error("Пожалуйста, подтвердите ваш email перед входом");
          return false;
        }

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
        id: (users.length + 1).toString(),
        username,
        email,
        password,
        registrationDate: new Date().toISOString().split("T")[0],
        isEmailVerified: false, // По умолчанию email не подтвержден
        telegramLink: profileData.telegramLink || "",
        githubLink: profileData.githubLink || "",
        languages: profileData.languages || [],
        experience: profileData.experience || "0-1",
        itPosition: profileData.itPosition || "",
        projects: profileData.projects || "",
        avatar: avatarUrl || "",
      };

      // Добавление в список пользователей
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Отправка письма для подтверждения
      const verificationLink = `http://yoursite.com/email-confirm?email=${encodeURIComponent(email)}&token=verify123`;
      const emailContent = `
        <h2>Подтверждение регистрации в DevNet</h2>
        <p>Здравствуйте, ${username}!</p>
        <p>Для подтверждения вашего аккаунта, пожалуйста, перейдите по следующей ссылке:</p>
        <p><a href="${verificationLink}" style="padding: 10px 20px; background-color: #0f4c81; color: white; text-decoration: none; border-radius: 5px;">Подтвердить email</a></p>
        <p>Если вы не регистрировались в DevNet, просто проигнорируй��е это письмо.</p>
        <p>С уважением, Команда DevNet</p>
      `;
      
      try {
        await sendEmail({
          name: username,
          email: email,
          message: emailContent
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
        // Продолжаем процесс регистрации даже если отправка письма не удалась
      }
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const verifyEmail = async (email: string, token: string): Promise<boolean> => {
    try {
      // В реальном приложении здесь была бы проверка токена
      // Для демонстрации просто обновляем статус верификации пользователя
      
      const updatedUsers = users.map(user => {
        if (user.email === email) {
          return { ...user, isEmailVerified: true };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      // Если текущий пользователь - это тот, чей email подтверждается
      if (user && user.email === email) {
        const updatedUser = { ...user, isEmailVerified: true };
        setUser(updatedUser);
        localStorage.setItem("devnet_user", JSON.stringify(updatedUser));
      }
      
      return true;
    } catch (error) {
      console.error("Email verification error:", error);
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
      // Проверяем, существует ли пользователь с таким email
      const foundUser = users.find((u) => u.email === email);
      
      if (!foundUser) {
        return false;
      }
      
      // Создание ссылки для сброса пароля
      const resetLink = `http://yoursite.com/reset-password?email=${encodeURIComponent(email)}&token=reset123`;
      const emailContent = `
        <h2>Сброс пароля в DevNet</h2>
        <p>Здравствуйте, ${foundUser.username}!</p>
        <p>Для сброса пароля, пожалуйста, перейдите по следующей ссылке:</p>
        <p><a href="${resetLink}" style="padding: 10px 20px; background-color: #0f4c81; color: white; text-decoration: none; border-radius: 5px;">Сбросить пароль</a></p>
        <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
        <p>С уважением, Команда DevNet</p>
      `;
      
      try {
        await sendEmail({
          name: foundUser.username,
          email: email,
          message: emailContent
        });
      } catch (error) {
        console.error("Error sending password reset email:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Forgot password error:", error);
      return false;
    }
  };

  const resetPassword = async (email: string, newPassword: string, token: string): Promise<boolean> => {
    try {
      // В реальном приложении здесь была бы проверка токена
      
      // Обновляем пароль пользователя
      const updatedUsers = users.map(user => {
        if (user.email === email) {
          return { ...user, password: newPassword };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      // Если текущий пользователь - это тот, чей пароль меняется
      if (user && user.email === email) {
        const updatedUser = { ...user, password: newPassword };
        setUser(updatedUser);
        localStorage.setItem("devnet_user", JSON.stringify(updatedUser));
      }
      
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
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
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
