// frontend/src/App.tsx

import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router";
import { LDProvider, useFlags } from "launchdarkly-react-client-sdk";
import { useEffect } from "react";

import { initializeAnalytics } from "@/lib/firebase";
import { LD_CLIENT_ID } from "@/constants.ts";
import { AuthProvider } from "@/contexts/authProvider.tsx";
import { TripsLayout } from "@/layouts/TripsLayout.tsx";
import { IndexPage } from "@/pages/IndexPage.tsx";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { TripListPage } from "@/pages/TripListPage";
import { TripNewPage } from "@/pages/TripNewPage";
import { TripEditPage } from "@/pages/TripEditPage";
import { MaintenancePage } from "@/pages/MaintenancePage.tsx";
import { TripShowPage } from "@/pages/TripShowPage.tsx";
import { NotFoundPage } from "@/pages/NotFoundPage.tsx";

export function App() {
  // Initialize Firebase Analytics
  useEffect(() => {
    void initializeAnalytics();
  }, []);

  // Render maintenance page if the feature flag is enabled
  const { maintenanceModeEnabled } = useFlags();
  if (maintenanceModeEnabled) {
    return <MaintenancePage />;
  }

  return (
    <>
      <BrowserRouter>
        <LDProvider clientSideID={LD_CLIENT_ID}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route element={<TripsLayout />}>
                {/* List all trips */}
                <Route path="/trips" element={<TripListPage />} />
                {/* Show trip creation form */}
                <Route path="/trips/new" element={<TripNewPage />} />
                {/* Show single trip */}
                <Route path="/trips/:id" element={<TripShowPage />} />
                {/* Show trip edit form */}
                <Route path="/trips/:id/edit" element={<TripEditPage />} />
                <Route path="/trips/*" element={<NotFoundPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </LDProvider>
      </BrowserRouter>
    </>
  );
}
