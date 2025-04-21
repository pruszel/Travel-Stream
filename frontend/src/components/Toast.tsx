// frontend/src/components/Toast.tsx

import { useContext } from "react";
import { ToastContext } from "@/contexts/toastContext.ts";

export function Toast() {
  const context = useContext(ToastContext);

  const toastClasses = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  };

  if (!context?.toasts.length) return null;

  return (
    <div className="toast">
      {context.toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`alert ${toastClasses[toast.type]}`}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
