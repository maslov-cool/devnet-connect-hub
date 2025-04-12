
import React, { createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useEmailService } from "../hooks/useEmailService";

// Clear the users array for initialization
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

  // Clear all users and reset localStorage on initialization
  useEffect(() => {
    // Clear localStorage on first load to reset all accounts
    localStorage.removeItem("devnet_users");
    localStorage.removeItem("devnet_user");
    
    const storedUsers = localStorage.getItem("devnet_users");
    
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

  // Save users to localStorage when they change
  useEffect(() => {
    localStorage.setItem("devnet_users", JSON.stringify(users));
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
    // Update current user
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser as User);
    localStorage.setItem("devnet_user", JSON.stringify(updatedUser));

    // Update in users list
    const updatedUsers = users.map((u) =>
      u.id === user?.id ? updatedUser : u
    );
    setUsers(updatedUsers as User[]);
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user) return false;

      // Remove user from list
      const updatedUsers = users.filter((u) => u.id !== user.id);
      setUsers(updatedUsers);
      
      // Logout
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
