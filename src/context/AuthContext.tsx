
import React, { createContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Sample user data for demonstration
const sampleUsers = [
  {
    id: "1",
    username: "john_dev",
    email: "john@example.com",
    password: "password123",
    avatar: "/lovable-uploads/71218a01-a00f-4c50-b88e-5016985aa63f.png",
    skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    currentlyStudying: ["GraphQL", "AWS"],
    experience: "3-5",
    specialization: "Full Stack Web Development",
    registrationDate: "2023-05-15",
    aboutMe: "Full Stack Developer with 5 years of experience"
  },
  {
    id: "2",
    username: "jane_dev",
    email: "jane@example.com",
    password: "password123",
    avatar: "/lovable-uploads/a5c8f24b-7c7c-491f-8c25-b774ac29eea0.png",
    skills: ["Python", "Django", "Flask", "PostgreSQL"],
    currentlyStudying: ["Docker", "Kubernetes"],
    experience: "1-3",
    specialization: "Backend Development",
    registrationDate: "2023-06-22",
    aboutMe: "Backend Developer specializing in Python"
  },
];

interface AuthContextType {
  user: any | null;
  users: any[];
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
  const [user, setUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize with sample users
    setUsers(sampleUsers);

    // Check if user is logged in from localStorage
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
      // Check if user with email already exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return false;
      }

      // Create new user
      const newUser = {
        id: (users.length + 1).toString(),
        username,
        email,
        password,
        registrationDate: new Date().toISOString().split("T")[0],
        ...profileData,
      };

      // Add to users list
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Auto-login
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
    // Update the current user
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("devnet_user", JSON.stringify(updatedUser));

    // Update in the users list
    const updatedUsers = users.map((u) =>
      u.id === user.id ? updatedUser : u
    );
    setUsers(updatedUsers);
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user) return false;

      // Remove user from users list
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
