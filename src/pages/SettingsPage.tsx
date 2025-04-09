
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "../hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user, deleteAccount } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success(t("language") === "ru" 
        ? "Аккаунт был успешно удален" 
        : "Account successfully deleted");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(t("language") === "ru" 
        ? "Произошла ошибка при удалении аккаунта" 
        : "An error occurred while deleting your account");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">{t("settings")}</h1>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">{t("deleteProfile")}</CardTitle>
            <CardDescription>
              {t("language") === "ru" 
                ? "Удаление аккаунта необратимо. Вся информация будет потеряна."
                : "Account deletion is irreversible. All information will be lost."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">{t("deleteProfile")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {t("language") === "ru" 
                      ? "Вы действительно хотите удалить аккаунт?"
                      : "Are you sure you want to delete your account?"}
                  </DialogTitle>
                  <DialogDescription>
                    {t("language") === "ru" 
                      ? "Это действие необратимо. Ваш аккаунт и все связанные данные будут полностью удалены."
                      : "This action is irreversible. Your account and all associated data will be permanently deleted."}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setDeleteDialogOpen(false)}
                    disabled={isDeleting}
                  >
                    {t("cancel")}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("language") === "ru" ? "Удаление..." : "Deleting..."}
                      </span>
                    ) : (
                      t("language") === "ru" ? "Удалить аккаунт" : "Delete account"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
