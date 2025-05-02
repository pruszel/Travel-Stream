// frontend/src/App.tsx

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { initializeAnalytics } from "@/lib/firebase";
import { AuthProvider } from "@/contexts/authProvider";
import { LDProvider } from "launchdarkly-react-client-sdk";
import { useEffect } from "react";
import { UserDisplay } from "@/components/UserDisplay.tsx";

const LD_CLIENT_ID = import.meta.env.PROD
  ? `67f0bff500b7a80955249fc7`
  : `67f0bff500b7a80955249fc6`;

export function App() {
  // Initialize Firebase Analytics
  useEffect(() => {
    void initializeAnalytics();
  }, []);

  return (
    <>
      <BrowserRouter>
        <LDProvider clientSideID={LD_CLIENT_ID}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LDProvider>
      </BrowserRouter>
    </>
  );
}

function IndexPage() {
  return <UserDisplay />;
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl">Page not found</p>
    </div>
  );
}
