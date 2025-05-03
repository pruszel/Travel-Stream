// frontend/src/pages/IndexPage.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router";
import { User } from "firebase/auth";

import * as tripService from "@/utils/tripService";
import { AuthContext } from "@/contexts/authContext";
import { ToastContext } from "@/contexts/toastContext";
import { IndexPage, SIGN_IN_TEXT } from "@/pages/IndexPage";
import { TripListPage, TRIP_LIST_PAGE_HEADER } from "@/pages/TripListPage.tsx";
import { TripsLayout } from "@/layouts/TripsLayout.tsx";

vi.mock("@/utils/tripService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils/tripService")>();
  return {
    ...actual,
    getTrips: vi.fn(),
  };
});

describe("<IndexPage />", () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("renders the sign in button when not logged in", () => {
    // mock AuthContext to simulate not logged in state
    const contextValue = {
      firebaseUser: null,
      isAuthStateLoading: false,
      authError: undefined,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    };

    render(
      <AuthContext.Provider value={contextValue}>
        <BrowserRouter>
          <IndexPage />
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText(SIGN_IN_TEXT)).toBeInTheDocument();
  });

  it("redirects to Trips List Page when user is logged in", async () => {
    // mock AuthContext to simulate logged in state
    const authContextValue = {
      firebaseUser: {
        uid: "12345",
        getIdToken: vi.fn().mockResolvedValue("fake-token"),
      } as unknown as User,
      isAuthStateLoading: false,
      authError: undefined,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    };

    const toastContextValue = {
      addToast: vi.fn(),
      removeToast: vi.fn(),
      toasts: [],
    };

    const mockedGetTrips = vi.mocked(tripService.getTrips);
    mockedGetTrips.mockResolvedValue({ data: [], error: undefined });

    render(
      <AuthContext.Provider value={authContextValue}>
        <ToastContext.Provider value={toastContextValue}>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route element={<TripsLayout />}>
                <Route path="/trips" element={<TripListPage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </ToastContext.Provider>
      </AuthContext.Provider>,
    );

    // Wait for the redirect and TripListPage to render
    await waitFor(() => {
      expect(screen.getByText(TRIP_LIST_PAGE_HEADER)).toBeInTheDocument();
    });

    expect(screen.queryByText(SIGN_IN_TEXT)).not.toBeInTheDocument();
  });
});
