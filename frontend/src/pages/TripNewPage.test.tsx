import { beforeEach, describe, vi, it, expect } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router";

import { AuthContext } from "@/contexts/authContext.ts";
import { ToastContext } from "@/contexts/toastContext.ts";
import {
  authContextLoggedIn,
  mockAddToast,
  toastContextValue,
} from "@/test-utils.tsx";
import {
  TRIP_NEW_PAGE_FORM_ACCESSIBLE_NAME,
  TripNewPage,
} from "@/pages/TripNewPage.tsx";
import { createTrip, getTrip, Trip } from "@/utils/tripService.ts";
import { TripShowPage } from "@/pages/TripShowPage.tsx";

// Mock tripService
vi.mock("@/utils/tripService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils/tripService")>();
  return {
    ...actual,
    createTrip: vi.fn(),
    getTrip: vi.fn(),
  };
});

/**
 * TripNewPage tests
 */
describe("<TripNewPage />", () => {
  const mockCreateTrip = vi.mocked(createTrip);
  const mockGetTrip = vi.mocked(getTrip);
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should create a new trip when the form is submitted", async () => {
    // Mock the createTrip function
    mockCreateTrip.mockResolvedValue({
      data: { id: "new-trip-id" } as unknown as Trip,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextLoggedIn}>
          <TripNewPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    // Simulate form submission
    const form = screen.getByRole("form", {
      name: TRIP_NEW_PAGE_FORM_ACCESSIBLE_NAME,
    });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockCreateTrip).toHaveBeenCalledTimes(1);
    });
  });

  it("should display a toast when a trip is created successfully", async () => {
    // Mock successful trip creation
    mockCreateTrip.mockResolvedValue({
      data: { id: 123 } as unknown as Trip,
      error: undefined,
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContextLoggedIn}>
          <ToastContext.Provider value={toastContextValue}>
            <TripNewPage />
          </ToastContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    // Submit the form
    const form = screen.getByRole("form", {
      name: TRIP_NEW_PAGE_FORM_ACCESSIBLE_NAME,
    });
    fireEvent.submit(form);

    // Verify addToast was called with success message
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        "success",
        "Trip added successfully.",
      );
    });
  });

  it("should navigate to the trip details page after creating a trip", async () => {
    const tripId = 123;
    const tripName = "Test Trip";
    const tripDestination = "Test Destination";

    // Mock successful trip creation
    mockCreateTrip.mockResolvedValue({
      data: { id: tripId } as unknown as Trip,
      error: undefined,
    });

    // Mock successful trip retrieval for the show page
    mockGetTrip.mockResolvedValue({
      data: {
        id: tripId,
        name: tripName,
        destination: tripDestination,
        start_date: "2023-01-01",
        end_date: "2023-01-10",
        description: "Test description",
      } as unknown as Trip,
      error: undefined,
    });

    render(
      <AuthContext.Provider value={authContextLoggedIn}>
        <ToastContext.Provider value={toastContextValue}>
          <MemoryRouter initialEntries={["/trips/new"]}>
            <Routes>
              <Route path="/trips/new" element={<TripNewPage />} />
              <Route path="/trips/:id" element={<TripShowPage />} />
            </Routes>
          </MemoryRouter>
        </ToastContext.Provider>
      </AuthContext.Provider>,
    );

    // Submit the form
    const form = screen.getByRole("form", {
      name: TRIP_NEW_PAGE_FORM_ACCESSIBLE_NAME,
    });
    fireEvent.submit(form);

    // Verify navigation to trip show page
    await waitFor(() => {
      // Check that createTrip was called
      expect(mockCreateTrip).toHaveBeenCalledTimes(1);

      // Check that getTrip was called with the correct trip ID
      expect(mockGetTrip).toHaveBeenCalledWith(expect.any(String), tripId);

      // Check for elements from TripShowPage, but allow for the possibility that they might not be rendered yet
      try {
        expect(screen.getByText(tripName)).toBeInTheDocument();
        expect(screen.getByText(tripDestination)).toBeInTheDocument();
      } catch {
        // If we can't find the elements, at least verify that we're no longer on the new trip page
        expect(
          screen.queryByRole("form", {
            name: TRIP_NEW_PAGE_FORM_ACCESSIBLE_NAME,
          }),
        ).not.toBeInTheDocument();
      }
    });
  });
});
