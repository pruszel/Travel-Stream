// frontend/src/contexts/toastContext.ts

import { createContext } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  expirationInSeconds?: number | null;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (
    type: ToastType,
    message: string,
    expirationInSeconds?: number,
  ) => void;
  removeToast: (id: number) => void;
}

const defaultToasts: Toast[] = [];

const defaultToastContext: ToastContextType = {
  toasts: defaultToasts,
  addToast: () => {
    return;
  },
  removeToast: () => {
    return;
  },
};

export const ToastContext =
  createContext<ToastContextType>(defaultToastContext);
