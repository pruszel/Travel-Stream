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
  mockAuthContextLoading,
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

    // Verify the TripListPage is displayed
    await waitFor(() => {
      expect(screen.getByText(PAGE_HEADER)).toBeInTheDocument();
    });

    // Verify that IndexPage is no longer displayed
    expect(screen.queryByText(SIGN_IN_TEXT)).not.toBeInTheDocument();
  });

  it("should render loading screen when auth state is loading", () => {
    render(
      <AuthContext.Provider value={mockAuthContextLoading}>
        <BrowserRouter>
          <IndexPage />
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should render loading screen when user is logged in while waiting for redirect to Trips List Page", () => {
    render(
      <AuthContext.Provider value={mockAuthContextLoggedIn}>
        <BrowserRouter>
          <IndexPage />
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
