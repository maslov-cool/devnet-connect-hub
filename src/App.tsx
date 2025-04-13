
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
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const queryClient = new QueryClient();

// Component for protected routes
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
                  {/* Redirect to login or home based on authentication */}
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  
                  {/* Routes inside Layout */}
                  <Route path="/" element={<Layout />}>
                    {/* Home page shows all developers */}
                    <Route path="home" element={<Index />} />
                    <Route path="messages" element={
                      <ProtectedRoute>
                        <MessagesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="messages/:userId" element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    } />
                    <Route path="about" element={<AboutCreatorsPage />} />
                    <Route path="for-developers" element={<ForDevelopersPage />} />
                    <Route path="profile/:id" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="settings" element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="recommended-users" element={
                      <ProtectedRoute>
                        <RecommendedUsersPage />
                      </ProtectedRoute>
                    } />
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
