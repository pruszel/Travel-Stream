import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { useFlags } from "launchdarkly-react-client-sdk";
import { MemoryRouter, Route, Routes } from "react-router";

import { TripsLayout } from "@/layouts/TripsLayout";
import { LOGIN_PAGE_SIGN_IN_TEXT, LoginPage } from "@/pages/LoginPage";
import { mockAuthContextLoggedOut } from "@/test-utils";
import { TripListPage } from "@/pages/TripListPage";
import { AuthContext } from "@/contexts/authContext";

// Mock the LaunchDarkly useFlags hook
vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({ killSwitchEnableGoogleSignIn: true }),
}));

describe("<TripsLayout />", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();

    //
    // Default return value for mocked functions
    //
    vi.mocked(useFlags).mockReturnValue({
      killSwitchEnableGoogleSignIn: true,
    });
  });

  it("should redirect to the login page when not authenticated", async () => {
    // Mock console.error to avoid logging errors in the test output
    vi.spyOn(console, "error").mockImplementation(() => {
      return;
    });
    render(
      <MemoryRouter initialEntries={["/trips"]}>
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<TripsLayout />}>
              <Route path="/trips" element={<TripListPage />} />
            </Route>
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Verify the login page is rendered
    await waitFor(() => {
      expect(screen.getByText(LOGIN_PAGE_SIGN_IN_TEXT));
    });
  });
});
