// frontend/src/pages/IndexPage.tsx

import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { LogIn } from "lucide-react";

import { AuthContext } from "@/contexts/authContext";
import { LoadingScreen } from "@/components/LoadingScreen";

export const SIGN_IN_TEXT = "Sign in";

export function IndexPage() {
  const { firebaseUser, isAuthStateLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to /trips if the user is authenticated
  useEffect(() => {
    if (firebaseUser) {
      void navigate("/trips", { replace: true });
    }
  }, [firebaseUser, navigate]);

  if (isAuthStateLoading || firebaseUser) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <Link to="/login" className="btn btn-primary gap-2">
              <LogIn />
              {SIGN_IN_TEXT}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
