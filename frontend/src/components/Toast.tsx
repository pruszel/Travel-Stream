// frontend/src/components/Toast.tsx

import { useContext } from "react";
import { ToastContext } from "@/contexts/toastContext.ts";

export function Toast() {
  const { toasts } = useContext(ToastContext);

  const toastClasses = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  };

  if (!toasts.length) return null;

  return toasts.map((toast) => (
    <div className="toast" key={toast.id}>
      <div role="alert" className={`alert ${toastClasses[toast.type]}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  ));
}
