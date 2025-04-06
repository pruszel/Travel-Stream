// user/hooks/useBackendAuth.ts

import { useCallback, useState } from "react";
import { User } from "firebase/auth";
import { API_BASE_URL } from "../../constants";

export function useBackendAuth() {
  const [backendLoadingStatus, setBackendLoadingStatus] =
    useState<boolean>(false);
  const [backendLoginError, setBackendLoginError] = useState<Error | null>(
    null,
  );
  const [isBackendLoggedIn, setIsBackendLoggedIn] = useState<boolean>(false);

  const handleFirebaseUserChange = async (firebaseUser: User | null) => {
    if (firebaseUser) {
      await checkBackendSession();
    }

    if (firebaseUser && !isBackendLoggedIn) {
      await loginToBackend(firebaseUser);
    }

    if (!firebaseUser) {
      await logoutFromBackend();
    }
  };

  const checkBackendSession = useCallback(async () => {
    setBackendLoadingStatus(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/session/`);
      setIsBackendLoggedIn(response.ok);
    } catch (error) {
      console.error("Error checking backend session: ", error);
      setIsBackendLoggedIn(false);
    } finally {
      setBackendLoadingStatus(false);
    }
  }, []);

  const loginToBackend = useCallback(async (firebaseUser: User) => {
    setBackendLoginError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/login/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
        },
      });
      setIsBackendLoggedIn(response.ok);
      if (!response.ok) {
        setBackendLoginError(new Error("Backend authentication failed"));
      }
    } catch (error) {
      console.error("Error logging in to backend: ", error);
      setBackendLoginError(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }, []);

  const logoutFromBackend = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/logout/`, {
        method: "POST",
      });
      if (response.ok) {
        setIsBackendLoggedIn(false);
      } else {
        console.error("Error logging out from backend: ", response.statusText);
      }
    } catch (error) {
      console.error("Error logging out from backend: ", error);
    }
  }, []);

  return {
    backendLoadingStatus,
    backendLoginError,
    handleFirebaseUserChange,
  };
}
