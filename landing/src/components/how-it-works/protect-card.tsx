"use client";

import { IconShield, IconLock, IconFlag, IconAlertTriangle } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ProtectionNotification {
  id: number;
  action: string;
  detail: string;
  type: "block" | "flag";
  icon: React.ReactNode;
}

export function ProtectCard() {
  const [notifications, setNotifications] = useState<ProtectionNotification[]>([
    {
      id: Date.now(),
      action: "Message blocked",
      detail: "Toxic language detected • User warned",
      type: "block" as const,
      icon: <IconLock className="w-4 h-4 text-red-400" />
    }
  ]);

  const actionTemplates = [
    {
      action: "Message blocked",
      detail: "Toxic language detected • User warned",
      type: "block" as const,
      icon: <IconLock className="w-4 h-4 text-red-400" />
    },
    {
      action: "Flagged for review",
      detail: "Potentially harmful content • Moderator notified",
      type: "flag" as const,
      icon: <IconFlag className="w-4 h-4 text-yellow-400" />
    },
    {
      action: "User auto-muted",
      detail: "Spam detection • 5 minute timeout",
      type: "block" as const,
      icon: <IconAlertTriangle className="w-4 h-4 text-red-400" />
    },
    {
      action: "PII protected",
      detail: "Personal info blocked • Privacy maintained",
      type: "block" as const,
      icon: <IconShield className="w-4 h-4 text-blue-400" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const template = actionTemplates[Math.floor(Math.random() * actionTemplates.length)];
      const notification: ProtectionNotification = {
        id: Date.now(),
        ...template
      };

      setNotifications(prev => [notification, ...prev].slice(0, 3));
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  const getActionColor = (type: string) => {
    switch (type) {
      case "block": return "text-red-400";
      case "flag": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="w-full h-[300px] flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center">
        <div className="h-[180px] w-full relative mt-8">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, y: -60, scale: 0.95 }}
              animate={{ 
                opacity: index === 0 ? 1 : index === 1 ? 0.8 : 0.6, 
                y: index * 20, 
                scale: 1 - (index * 0.05),
                zIndex: notifications.length - index
              }}
              exit={{ opacity: 0, scale: 0.9, zIndex: -1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30,
                mass: 0.8,
                exit: { duration: 0.8 }
              }}
              className="absolute top-0 left-0 right-0 p-3 bg-neutral-900/95 backdrop-blur-sm rounded-lg border border-neutral-600"
              style={{
                boxShadow: `0 ${index * 2}px ${8 + index * 4}px rgba(0,0,0,0.2)`,
                zIndex: notifications.length - index
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {notification.icon}
                <span className={`font-medium text-sm ${getActionColor(notification.type)}`}>
                  {notification.action}
                </span>
              </div>
              <p className="text-xs text-gray-400">{notification.detail}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}