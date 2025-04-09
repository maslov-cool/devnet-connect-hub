
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  telegram: string;
  registrationDate: string;
}

const ForDevelopersPage = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const users: User[] = [
    {
      id: "1",
      name: "Александр",
      telegram: "1",
      registrationDate: "9 апр. 2025 г., 15:22"
    },
    {
      id: "2",
      name: "ten-fun",
      telegram: "1",
      registrationDate: "9 апр. 2025 г., 15:23"
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.telegram.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allowedUsers = [
    { username: "ilazorin", password: "243546" },
    { username: "ten-fun", password: "190324" }
  ];

  const handleLogin = () => {
    const found = allowedUsers.find(
      u => u.username === username && u.password === password
    );

    if (found) {
      setIsAuthenticated(true);
      toast.success(t("accessGranted"));
    } else {
      toast.error(t("language") === "ru" ? "Неверные учетные данные" : "Invalid credentials");
    }
  };

  const handleExportToCSV = () => {
    // In a real app, we'd generate and download a CSV file
    toast.success(t("language") === "ru" ? "Экспорт в CSV выполнен" : "Exported to CSV");
  };

  const handleExportToExcel = () => {
    // In a real app, we'd generate and download an Excel file
    toast.success(t("language") === "ru" ? "Экспорт в Excel выполнен" : "Exported to Excel");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t("forDevelopers")}</CardTitle>
              <CardDescription>
                {t("language") === "ru" 
                  ? "Пожалуйста, войдите для доступа к данным" 
                  : "Please log in to access data"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t("username")}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleLogin}>
                  {t("login")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-2">{t("usersData")}</h1>
          <p className="text-muted-foreground mb-8">{t("usersInfo")}</p>

          <div className="grid gap-8">
            {/* Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle>{t("activityOverview")}</CardTitle>
                <CardDescription>{t("userActivityStats")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">{t("totalUsers")}</h3>
                    <p className="text-4xl font-bold">{users.length}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">{t("newThisWeek")}</h3>
                    <p className="text-4xl font-bold">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>{t("users")}</CardTitle>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        placeholder={t("search")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full md:w-[250px]"
                      />
                    </div>
                    <Button variant="outline" onClick={handleExportToCSV}>
                      <Download className="mr-2 h-4 w-4" />
                      {t("exportToCsv")}
                    </Button>
                    <Button onClick={handleExportToExcel}>
                      <Download className="mr-2 h-4 w-4" />
                      {t("exportToExcel")}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("name")}</TableHead>
                        <TableHead>{t("telegram")}</TableHead>
                        <TableHead>{t("registrationDate")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.telegram}</TableCell>
                          <TableCell>{user.registrationDate}</TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                            {t("language") === "ru" 
                              ? "Пользователи не найдены" 
                              : "No users found"
                            }
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ForDevelopersPage;
