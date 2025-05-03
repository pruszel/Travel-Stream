// frontend/src/pages/TripShowPage.test.tsx

import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

import { AuthContext } from "@/contexts/authContext";
import { getTrip } from "@/utils/tripService";
import { authContextLoggedIn } from "@/test-utils";
import { TripShowPage } from "@/pages/TripShowPage";

// Mock tripService
vi.mock("@/utils/tripService", () => ({
  getTrip: vi.fn(),
}));

/**
 * TripShowPage tests
 */
describe("<TripShowPage />", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should display the trip details when the page loads", async () => {
    const tripName = "Test Trip";
    const tripDestination = "Test Destination";
    const tripDescription = "This is a test trip";
    const tripStartDate = "2023-01-01";
    const tripEndDate = "2023-01-10";

    // Mock successfully getting the trip details
    vi.mocked(getTrip).mockResolvedValue({
      data: {
        id: 1,
        name: tripName,
        destination: tripDestination,
        description: tripDescription,
        start_date: tripStartDate,
        end_date: tripEndDate,
      },
      error: undefined,
    });

    render(
      <MemoryRouter initialEntries={["/trips/1"]}>
        <AuthContext.Provider value={authContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id" element={<TripShowPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(tripName)).toBeInTheDocument();
      expect(screen.getByText(tripDestination)).toBeInTheDocument();
      expect(screen.getByText(tripDescription)).toBeInTheDocument();
      expect(
        screen.getByText(`${tripStartDate} - ${tripEndDate}`),
      ).toBeInTheDocument();
    });
  });
});
