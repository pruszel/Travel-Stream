// frontend/src/pages/IndexPage.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router";

import { getTrips } from "@/utils/tripService";
import { AuthContext } from "@/contexts/authContext";
import { ToastContext } from "@/contexts/toastContext";
import { IndexPage, SIGN_IN_TEXT } from "@/pages/IndexPage";
import { TripListPage, PAGE_HEADER } from "@/pages/TripListPage";
import {
  mockAuthContextLoggedIn,
  mockAuthContextLoggedOut,
  mockGetIdToken,
  mockToastContextValue,
} from "@/test-utils";

vi.mock("@/utils/tripService", () => ({
  getTrips: vi.fn(),
}));

describe("<IndexPage />", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.mocked(mockGetIdToken).mockResolvedValue("fake-token");
  });

  // authContextLoggedIn.firebaseUser.getIdToken.mockResolvedValue("fake-token");
  it("renders the sign in button when logged out", () => {
    render(
      <AuthContext.Provider value={mockAuthContextLoggedOut}>
        <BrowserRouter>
          <IndexPage />
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText(SIGN_IN_TEXT)).toBeInTheDocument();
  });

  it("redirects to Trips List Page when user is logged in", async () => {
    vi.mocked(getTrips).mockResolvedValue({
      data: [],
      error: undefined,
    });

    render(
      <AuthContext.Provider value={mockAuthContextLoggedIn}>
        <ToastContext.Provider value={mockToastContextValue}>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/trips" element={<TripListPage />} />
            </Routes>
          </MemoryRouter>
        </ToastContext.Provider>
      </AuthContext.Provider>,
    );

    // Wait for the redirect and TripListPage to render
    await waitFor(() => {
      expect(screen.getByText(PAGE_HEADER)).toBeInTheDocument();
    });

    expect(screen.queryByText(SIGN_IN_TEXT)).not.toBeInTheDocument();
  });
});
