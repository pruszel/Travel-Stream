// frontend/src/hooks/useRequireAuth.ts

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "@/contexts/authContext";

/**
 * A hook that requires authentication to access a page.
 * If the user is not authenticated, they will be redirected to the login page.
 */
export function useRequireAuth() {
  const { firebaseUser, isAuthStateLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after auth state is loaded and user is not authenticated
    if (!isAuthStateLoading && !firebaseUser) {
      void navigate("/login", { replace: true });
    }
  }, [firebaseUser, isAuthStateLoading, navigate]);

  return { firebaseUser, isAuthStateLoading };
}
