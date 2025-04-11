
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
  pendingUsers: User[];
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
  pendingUsers: [],
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { sendEmail } = useEmailService();

  useEffect(() => {
    // Очищаем существующих пользователей при инициализации
    localStorage.removeItem("devnet_users");
    localStorage.removeItem("devnet_pending_users");
    localStorage.removeItem("devnet_user");
    
    // Инициализируем пустыми массивами
    setUsers([]);
    setPendingUsers([]);
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.setItem("devnet_users", JSON.stringify([]));
    localStorage.setItem("devnet_pending_users", JSON.stringify([]));
  }, []);

  // Сохранение пользователей в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("devnet_users", JSON.stringify(users));
  }, [users]);
  
  // Сохранение ожидающих подтверждения пользователей
  useEffect(() => {
    localStorage.setItem("devnet_pending_users", JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Найти пользователя с соответствующим email и паролем
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        // Проверяем, подтвержден ли email (на всякий случай, хотя это не должно быть нужно)
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
      // Проверка, существует ли пользователь с таким email среди подтвержденных
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        toast.error("Пользователь с таким email уже существует");
        return false;
      }
      
      // Проверка, есть ли уже ожидающий подтверждения пользователь с таким email
      const pendingUser = pendingUsers.find((u) => u.email === email);
      if (pendingUser) {
        toast.error("Регистрация с этим email уже ожидает подтверждения");
        return false;
      }

      // Определение аватара
      let avatarUrl = "";
      if (profileData.generatedAvatarUrl) {
        avatarUrl = profileData.generatedAvatarUrl;
      }

      // Создание нового пользователя (он будет в статусе pending)
      const newUser = {
        id: Date.now().toString(), // Уникальный ID на основе времени
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

      // Добавление в список ожидающих подтверждения пользователей
      const updatedPendingUsers = [...pendingUsers, newUser];
      setPendingUsers(updatedPendingUsers);
      
      // Отправка письма для подтверждения
      const token = `verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const verificationLink = `${window.location.origin}/email-confirm?email=${encodeURIComponent(email)}&token=${token}`;
      const emailContent = `
        <h2>Подтверждение регистрации в DevNet</h2>
        <p>Здравствуйте, ${username}!</p>
        <p>Для подтверждения вашего аккаунта, пожалуйста, перейдите по следующей ссылке:</p>
        <p><a href="${verificationLink}" style="padding: 10px 20px; background-color: #0f4c81; color: white; text-decoration: none; border-radius: 5px;">Подтвердить email</a></p>
        <p>Если вы не регистрировались в DevNet, просто проигнорируйте это письмо.</p>
        <p>С уважением, Команда DevNet</p>
      `;
      
      try {
        await sendEmail({
          name: username,
          email: email,
          message: emailContent,
          subject: "DevNet: Подтверждение регистрации"
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
        toast.error("Ошибка при отправке письма для подтверждения");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const verifyEmail = async (email: string, token: string): Promise<boolean> => {
    try {
      // Находим пользователя в списке ожидающих подтверждения
      const pendingUser = pendingUsers.find((u) => u.email === email);
      
      if (!pendingUser) {
        toast.error("Пользователь не найден или уже подтвержден");
        return false;
      }
      
      // Добавляем пользователя в список подтвержденных
      const verifiedUser = { ...pendingUser, isEmailVerified: true };
      const updatedUsers = [...users, verifiedUser];
      setUsers(updatedUsers);
      
      // Удаляем пользователя из списка ожидающих
      const updatedPendingUsers = pendingUsers.filter(u => u.email !== email);
      setPendingUsers(updatedPendingUsers);
      
      // Отправляем уведомление об успешной регистрации
      const welcomeEmailContent = `
        <h2>Добро пожаловать в DevNet!</h2>
        <p>Здравствуйте, ${verifiedUser.username}!</p>
        <p>Ваша регистрация успешно завершена. Теперь вы можете войти в систему, используя ваш email и пароль.</p>
        <p>С уважением, Команда DevNet</p>
      `;
      
      try {
        await sendEmail({
          name: verifiedUser.username,
          email: verifiedUser.email,
          message: welcomeEmailContent,
          subject: "DevNet: Успешная регистрация!"
        });
      } catch (error) {
        console.error("Error sending welcome email:", error);
        // Продолжаем процесс верификации, даже если отправка письма не удалась
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
      const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const resetLink = `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;
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
          message: emailContent,
          subject: "DevNet: Сброс пароля"
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
        pendingUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
