
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import MessagesPage from "./pages/MessagesPage";
import AboutCreatorsPage from "./pages/AboutCreatorsPage";
import ForDevelopersPage from "./pages/ForDevelopersPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./context/NotificationContext";
import RecommendedUsersPage from "./pages/RecommendedUsersPage";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Компонент для защищенных маршрутов
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="devnet-theme">
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Перенаправляем корневой путь на страницу входа */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Защищенные маршруты */}
                  <Route path="/" element={
                    <Layout />
                  }>
                    <Route path="home" element={<Index />} />
                    <Route path="messages" element={<MessagesPage />} />
                    <Route path="messages/:userId" element={<ChatPage />} />
                    <Route path="about" element={<AboutCreatorsPage />} />
                    <Route path="for-developers" element={<ForDevelopersPage />} />
                    <Route path="profile/:id" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="recommended-users" element={<RecommendedUsersPage />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
