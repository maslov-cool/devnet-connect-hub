
import React, { createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useEmailService } from "../hooks/useEmailService";

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
  verifyEmail: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string) => Promise<boolean>;
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
  verifyEmail: async () => false,
  forgotPassword: async () => false,
  resetPassword: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const USERS_STORAGE_KEY = "devnet_users";
const CURRENT_USER_STORAGE_KEY = "devnet_user";

// Predefined list of developers
const defaultDevelopers: User[] = [
  {
    id: "1",
    username: "Alex Smith",
    email: "alex@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=1",
    skills: ["JavaScript", "React", "Node.js"],
    languages: ["English", "Spanish"],
    experience: "3-5",
    itPosition: "Frontend Developer",
    registrationDate: "2023-01-15",
    telegramLink: "@alexsmith",
    githubLink: "github.com/alexsmith"
  },
  {
    id: "2",
    username: "Maria Garcia",
    email: "maria@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=5",
    skills: ["Python", "Django", "MySQL"],
    languages: ["Spanish", "English", "French"],
    experience: "5-10",
    itPosition: "Backend Developer",
    registrationDate: "2022-11-20",
    telegramLink: "@mariagarcia",
    githubLink: "github.com/mariagarcia"
  },
  {
    id: "3",
    username: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=3",
    skills: ["TypeScript", "React", "GraphQL"],
    languages: ["English"],
    experience: "1-3",
    itPosition: "Full Stack Developer",
    registrationDate: "2023-03-05",
    telegramLink: "@johndoe",
    githubLink: "github.com/johndoe"
  },
  {
    id: "4",
    username: "Sophia Wang",
    email: "sophia@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=9",
    skills: ["Java", "Spring", "PostgreSQL"],
    languages: ["Chinese", "English"],
    experience: "3-5",
    itPosition: "Backend Developer",
    registrationDate: "2023-02-10",
    telegramLink: "@sophiawang",
    githubLink: "github.com/sophiawang"
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { sendEmail } = useEmailService();

  useEffect(() => {
    // Load users from localStorage or use default developers
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(defaultDevelopers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultDevelopers));
    }
    
    // Check if user is logged in
    const savedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(foundUser));
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
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        toast.error("Пользователь с таким email уже существует");
        return false;
      }

      let avatarUrl = "";
      if (profileData.generatedAvatarUrl) {
        avatarUrl = profileData.generatedAvatarUrl;
      }

      const registrationDate = new Date().toISOString().split('T')[0];
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        registrationDate: registrationDate,
        telegramLink: profileData.telegramLink || "",
        githubLink: profileData.githubLink || "",
        languages: profileData.languages || [],
        experience: profileData.experience || "0-1",
        itPosition: profileData.itPosition || "",
        projects: profileData.projects || "",
        avatar: avatarUrl || "",
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  const updateUser = (userData: any) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser as User);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser));

    const updatedUsers = users.map((u) =>
      u.id === user?.id ? updatedUser : u
    );
    setUsers(updatedUsers as User[]);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user) return false;

      const updatedUsers = users.filter((u) => u.id !== user.id);
      setUsers(updatedUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);

      return true;
    } catch (error) {
      console.error("Delete account error:", error);
      return false;
    }
  };

  const verifyEmail = async (email: string): Promise<boolean> => {
    console.log(`Verifying email for ${email}`);
    return true;
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    console.log(`Forgot password requested for email: ${email}`);
    const userExists = users.some(u => u.email === email);
    if (userExists) {
      return true;
    }
    return false;
  };

  const resetPassword = async (email: string, token: string): Promise<boolean> => {
    console.log(`Resetting password for ${email} with token ${token}`);
    return true;
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
        verifyEmail,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
