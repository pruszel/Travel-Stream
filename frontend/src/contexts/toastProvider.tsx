// frontend/src/contexts/toastProvider.tsx

import * as React from "react";
import { useCallback, useMemo, useState } from "react";

import { DEFAULT_TOAST_EXPIRATION_IN_SECONDS } from "@/constants";
import { ToastContext, Toast, ToastType } from "@/contexts/toastContext";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (
      type: ToastType,
      message: string,
      expirationInSeconds = DEFAULT_TOAST_EXPIRATION_IN_SECONDS,
    ) => {
      const id = Date.now();
      setToasts((prevToasts) => [...prevToasts, { id, type, message }]);

      if (expirationInSeconds) {
        return setTimeout(() => {
          removeToast(id);
        }, expirationInSeconds * 1000);
      }
    },
    [removeToast],
  );

  const contextValue = useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};
