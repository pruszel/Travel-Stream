// frontend/src/pages/IndexPage.tsx

import { useContext } from "react";
import { Link, Navigate } from "react-router";
import { LogIn } from "lucide-react";

import { AuthContext } from "@/contexts/authContext";

export function IndexPage() {
  const { firebaseUser } = useContext(AuthContext);
  if (firebaseUser) {
    return <Navigate to="/trips" replace />;
  }

  return (
    <>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <Link to="/login" className="btn btn-primary gap-2">
              <LogIn />
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
