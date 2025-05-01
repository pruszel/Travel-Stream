// frontend/src/pages/TripListPage.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthContext } from "@/contexts/authContext.ts";
import { authContextLoggedIn } from "@/test-utils.tsx";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router";
import {
  TRIP_LIST_PAGE_ADD_TRIP_BUTTON_TEXT,
  TripListPage,
} from "@/pages/TripListPage.tsx";
import {
  screen,
  render,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { TRIP_NEW_PAGE_HEADER, TripNewPage } from "@/pages/TripNewPage.tsx";
import { getTrips, Trip } from "@/utils/tripService";

// Mock tripService
vi.mock("@/utils/tripService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils/tripService")>();
  return {
    ...actual,
    getTrips: vi.fn(),
  };
});

/**
 * TripListPage tests
 */
describe("<TripListPage />", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("redirects to TripNewPage when 'Add Trip' button is clicked", async () => {
    vi.mocked(getTrips).mockResolvedValue({
      data: [],
      error: undefined,
    });

    render(
      <AuthContext.Provider value={authContextLoggedIn}>
        <MemoryRouter initialEntries={["/trips"]}>
          <Routes>
            <Route path="/trips" element={<TripListPage />} />
            <Route path="/trips/new" element={<TripNewPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    fireEvent.click(screen.getByText(TRIP_LIST_PAGE_ADD_TRIP_BUTTON_TEXT));

    await waitFor(() => {
      expect(screen.getByText(TRIP_NEW_PAGE_HEADER)).toBeInTheDocument();
    });
  });

  it("loads and displays trips", async () => {
    const mockTrips = [
      { id: 1, name: "Trip 1" } as unknown as Trip,
      { id: 2, name: "Trip 2" } as unknown as Trip,
    ];

    vi.mocked(getTrips).mockResolvedValue({
      data: mockTrips,
      error: undefined,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextLoggedIn}>
          <TripListPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("My Trips")).toBeInTheDocument();
      expect(screen.getByText("Trip 1")).toBeInTheDocument();
      expect(screen.getByText("Trip 2")).toBeInTheDocument();
    });
  });
});
