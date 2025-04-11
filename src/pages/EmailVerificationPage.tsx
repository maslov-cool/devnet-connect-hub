
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "../hooks/useTranslation";
import { CheckCircle2, Bug, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEmailService } from "../hooks/useEmailService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const EmailVerificationPage = () => {
  const { t } = useTranslation();
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const { sendEmail, isSending, error, debug, rawResponse } = useEmailService();
  
  // Function to send a test email
  const handleSendTestEmail = async () => {
    await sendEmail({
      email: "test@example.com", // Replace with your email for testing
      message: "<h1>Test Email</h1><p>This is a test email from DevNet to verify email sending is working.</p>",
      subject: "DevNet Test Email"
    });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle>{t("language") === "ru" ? "Проверьте вашу почту" : "Check Your Email"}</CardTitle>
          <CardDescription>
            {t("language") === "ru" 
              ? "Мы отправили письмо с подтверждением на указанный вами адрес электронной почты"
              : "We've sent a verification email to your email address"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <p>
              {t("language") === "ru" 
                ? "Пожалуйста, проверьте вашу почту и следуйте инструкциям для подтверждения аккаунта."
                : "Please check your inbox and follow the instructions to verify your account."
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {t("language") === "ru" 
                ? "Если вы не получили письмо, проверьте папку 'Спам' или 'Нежелательная почта'."
                : "If you don't see the email, check your spam or junk folder."
              }
            </p>
            
            {/* Diagnostic section */}
            <Collapsible open={showDiagnostic} onOpenChange={setShowDiagnostic} className="mt-8 border-t pt-4">
              <CollapsibleTrigger className="flex items-center justify-center w-full text-sm text-muted-foreground hover:text-foreground">
                <Bug className="mr-2 h-4 w-4" />
                {t("language") === "ru" ? "Диагностика отправки писем" : "Email Sending Diagnostics"}
                {showDiagnostic ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-4 text-left">
                  <p className="text-sm">
                    {t("language") === "ru" 
                      ? "Этот раздел помогает диагностировать проблемы с отправкой писем"
                      : "This section helps diagnose email sending issues"
                    }
                  </p>
                  
                  <Button 
                    onClick={handleSendTestEmail} 
                    variant="outline" 
                    disabled={isSending}
                    className="w-full"
                  >
                    {isSending ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t("language") === "ru" ? "Отправка..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        {t("language") === "ru" ? "Отправить тестовое письмо" : "Send Test Email"}
                      </>
                    )}
                  </Button>
                  
                  {error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTitle>{t("language") === "ru" ? "Ошибка" : "Error"}</AlertTitle>
                      <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {debug && (
                    <Alert className="mt-2">
                      <AlertTitle>{t("language") === "ru" ? "Отладка SMTP" : "SMTP Debug"}</AlertTitle>
                      <AlertDescription className="text-xs whitespace-pre-wrap overflow-auto max-h-40">
                        {debug}
                      </AlertDescription>
                    </Alert>
                  )}

                  {rawResponse && (
                    <Alert className="mt-2">
                      <AlertTitle>{t("language") === "ru" ? "Ответ сервера" : "Server Response"}</AlertTitle>
                      <AlertDescription className="text-xs whitespace-pre-wrap overflow-auto max-h-40">
                        {rawResponse}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    <p>
                      {t("language") === "ru" 
                        ? "Проверьте файл email_debug_log.txt на сервере для получения подробной информации об ошибках"
                        : "Check the email_debug_log.txt file on the server for detailed error information"
                      }
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="space-y-2 w-full">
            <Button asChild className="w-full">
              <Link to="/login">
                {t("language") === "ru" ? "Перейти к странице входа" : "Go to login page"}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                {t("language") === "ru" ? "Вернуться на главную" : "Return to home page"}
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;
