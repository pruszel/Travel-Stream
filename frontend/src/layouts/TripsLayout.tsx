// frontend/src/layouts/TripsLayout.tsx

import { useContext } from "react";
import { Navigate, Outlet } from "react-router";

import { AUTH_ERROR_MESSAGE } from "@/constants.ts";
import { ToastContext } from "@/contexts/toastContext.ts";
import { ToastProvider } from "@/contexts/toastProvider.tsx";
import { Toast } from "@/components/Toast.tsx";
import { Header } from "@/components/Header.tsx";
import { ContentWrapper } from "@/components/ContentWrapper.tsx";
import { AuthContext } from "@/contexts/authContext.ts";

export function TripsLayout() {
  const { firebaseUser, isAuthStateLoading, authError } =
    useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  // Redirect to login page if not authenticated
  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  // Show loading state
  if (isAuthStateLoading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  if (authError) {
    console.error(`Error during sign in with Google: ${authError}`);
    addToast("error", AUTH_ERROR_MESSAGE);
  }

  return (
    <>
      <div className="py-8 grid grid-cols-1 justify-stretch max-w-4xl mx-auto">
        <ToastProvider>
          <Toast />
        </ToastProvider>
        <Header />

        <ContentWrapper>
          <main className="flex flex-col">
            <Outlet />
          </main>
        </ContentWrapper>
      </div>
    </>
  );
}
