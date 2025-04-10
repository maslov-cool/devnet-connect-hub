
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';

interface NotificationContextType {
  showNotification: (title: string, message: string) => void;
  newMessageNotification: (sender: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
  newMessageNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();

  const showNotification = (title: string, message: string) => {
    toast(title, {
      description: message,
    });
  };

  const newMessageNotification = (sender: string, message: string) => {
    toast(t("language") === "ru" ? "Новое сообщение" : "New message", {
      description: `${sender}: ${message.length > 30 ? message.substring(0, 30) + '...' : message}`,
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification, newMessageNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
