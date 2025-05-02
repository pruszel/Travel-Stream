// frontend/src/contexts/toastProvider.tsx

import * as React from "react";
import { useCallback, useMemo, useState } from "react";

import { DEFAULT_TOAST_EXPIRATION_IN_SECONDS } from "@/constants";
import { ToastContext, Toast, ToastType } from "@/contexts/toastContext";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Removes a toast message from the list of toasts in the context.
   * @param id - The unique identifier of the toast to remove, based on timestamp and random number.
   */
  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Adds a new toast message to the list of toasts in the context.
   * @param type - The type of the toast (success, error, warning, info).
   * @param message - The message to display in the toast.
   * @param expirationInSeconds - The duration in seconds after which the toast should disappear.
   *                              For persistent toasts, pass a negative number.
   */
  const addToast = useCallback(
    (
      type: ToastType,
      message: string,
      expirationInSeconds = DEFAULT_TOAST_EXPIRATION_IN_SECONDS,
    ) => {
      const id = Date.now() + Math.random(); // Unique ID based on timestamp and random number
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, type, message, expirationInSeconds },
      ]);

      if (expirationInSeconds > 0) {
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
