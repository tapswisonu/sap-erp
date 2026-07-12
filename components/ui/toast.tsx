"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (props: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...props }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className={`min-w-[300px] p-4 rounded-xl shadow-lg border flex items-start gap-3 backdrop-blur-md ${
                t.type === "success" 
                  ? "bg-emerald-50/90 border-emerald-200 dark:bg-emerald-950/80 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
                  : "bg-red-50/90 border-red-200 dark:bg-red-950/80 dark:border-red-800 text-red-900 dark:text-red-100"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === "success" ? <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400" /> : <XCircle size={18} className="text-red-500 dark:text-red-400" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold">{t.title}</h4>
                {t.message && <p className="text-xs opacity-80 mt-1">{t.message}</p>}
              </div>
              <button onClick={() => removeToast(t.id)} className="shrink-0 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
