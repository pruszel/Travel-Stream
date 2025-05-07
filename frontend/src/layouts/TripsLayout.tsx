// frontend/src/layouts/TripsLayout.tsx

import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { AUTH_ERROR_MESSAGE } from "@/constants";
import { ToastContext } from "@/contexts/toastContext";
import { ToastProvider } from "@/contexts/toastProvider";
import { Toast } from "@/components/Toast";
import { Header } from "@/components/Header";
import { ContentWrapper } from "@/components/ContentWrapper";
import { AuthContext } from "@/contexts/authContext";
import { LoadingScreen } from "@/components/LoadingScreen";

export function TripsLayout() {
  const { firebaseUser, isAuthStateLoading, authError } =
    useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isAuthStateLoading && !firebaseUser) {
      void navigate("/login", { replace: true });
    }
  }, [firebaseUser, navigate]);

  // Show loading state
  if (isAuthStateLoading) {
    return <LoadingScreen />;
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
