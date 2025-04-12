
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
  // Add the missing methods that are causing build errors
  verifyEmail: (token: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
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
  // Add the missing methods that are causing build errors
  verifyEmail: async () => false,
  forgotPassword: async () => false,
  resetPassword: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// Key for localStorage
const USERS_STORAGE_KEY = "devnet_users";
const CURRENT_USER_STORAGE_KEY = "devnet_user";

// Function to save messages between users
const saveMessages = (messages: any[], conversationKey: string) => {
  localStorage.setItem(`chat_${conversationKey}`, JSON.stringify(messages));
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { sendEmail } = useEmailService();

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Failed to parse stored users:", error);
        // Initialize with empty array if parsing fails
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      }
    } else {
      // Initialize with empty array if no users exist
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
    }

    // Check if there's a logged-in user
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    }
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Find user with matching email and password
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
      // Check if user with this email already exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        toast.error("Пользователь с таким email уже существует");
        return false;
      }

      // Determine avatar
      let avatarUrl = "";
      if (profileData.generatedAvatarUrl) {
        avatarUrl = profileData.generatedAvatarUrl;
      }

      // Create new user with current registration date
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

      // Add user to list and login immediately
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Auto-login the user after registration
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
    // Update current user
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser as User);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser));

    // Update in users list
    const updatedUsers = users.map((u) =>
      u.id === user?.id ? updatedUser : u
    );
    setUsers(updatedUsers as User[]);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user) return false;

      // Remove user from list
      const updatedUsers = users.filter((u) => u.id !== user.id);
      setUsers(updatedUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      // Logout
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);

      return true;
    } catch (error) {
      console.error("Delete account error:", error);
      return false;
    }
  };

  // Implement the missing methods to fix build errors
  const verifyEmail = async (token: string): Promise<boolean> => {
    // In a real app, you would verify the token with the backend
    // For now, we'll just return true to fix the build error
    return true;
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Find if the user exists
    const userExists = users.some(u => u.email === email);
    if (userExists) {
      // In a real app, you would send an email with a reset token
      // For now, we'll just return true
      return true;
    }
    return false;
  };

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    // In a real app, you would verify the token and update the user's password
    // For now, we'll just return true to fix the build error
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
