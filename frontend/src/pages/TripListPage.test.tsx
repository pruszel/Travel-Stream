// frontend/src/pages/TripListPage.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router";
import {
  screen,
  render,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";

import { AuthContext } from "@/contexts/authContext";
import {
  mockAuthContextLoggedIn,
  mockAuthContextLoggedOut,
  mockAddToast,
  mockGetIdToken,
  mockToastContextValue,
  mockTrips,
} from "@/test-utils";
import {
  ADD_TRIP_BUTTON_TEXT,
  DELETE_TRIP_BUTTON_LABEL,
  NO_TRIPS_TEXT,
  TripListPage,
} from "@/pages/TripListPage";
import { TRIP_NEW_PAGE_HEADER, TripNewPage } from "@/pages/TripNewPage";
import { getTrip, getTrips, deleteTrip } from "@/utils/tripService";
import { ToastContext } from "@/contexts/toastContext";
import { FRIENDLY_ERROR_MESSAGES } from "@/constants";
import { TripShowPage } from "@/pages/TripShowPage.tsx";

// Mock tripService
vi.mock("@/utils/tripService", () => ({
  getTrips: vi.fn(),
  getTrip: vi.fn(),
  deleteTrip: vi.fn(),
}));

/**
 * TripListPage tests
 */
describe("<TripListPage />", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
    //
    // Default return value for mocked functions
    //
    vi.mocked(mockGetIdToken).mockResolvedValue("fake-token");
    vi.mocked(getTrips).mockResolvedValue({
      data: mockTrips,
      error: undefined,
    });
    vi.mocked(deleteTrip).mockResolvedValue({
      data: undefined,
      error: undefined,
    });
    // Confirm dialog returns true
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("should redirect to TripNewPage when the 'Add Trip' button is clicked", async () => {
    render(
      <AuthContext.Provider value={mockAuthContextLoggedIn}>
        <MemoryRouter initialEntries={["/trips"]}>
          <Routes>
            <Route path="/trips" element={<TripListPage />} />
            <Route path="/trips/new" element={<TripNewPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    // Click the 'Add Trip' button
    fireEvent.click(screen.getByText(ADD_TRIP_BUTTON_TEXT));

    // Verify the TripNewPage is displayed
    await waitFor(() => {
      expect(screen.getByText(TRIP_NEW_PAGE_HEADER)).toBeInTheDocument();
    });
  });

  it("should navigate to the TripShowPage when a trip is clicked", async () => {
    // Mock the getTrip function called from TripShowPage to return a specific trip
    vi.mocked(getTrip).mockResolvedValue({
      data: mockTrips[0],
      error: undefined,
    });

    render(
      <AuthContext.Provider value={mockAuthContextLoggedIn}>
        <MemoryRouter initialEntries={["/trips"]}>
          <Routes>
            <Route path="/trips" element={<TripListPage />} />
            <Route path="/trips/:id" element={<TripShowPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    // Click on the first trip
    await waitFor(() => {
      fireEvent.click(screen.getByText(mockTrips[0].name));
    });

    // Verify that we are redirected to the TripShowPage
    await waitFor(() => {
      expect(screen.getByText(mockTrips[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockTrips[0].destination)).toBeInTheDocument();
      expect(screen.getByText(mockTrips[0].description)).toBeInTheDocument();
      expect(
        screen.getByText(
          `${mockTrips[0].start_date} - ${mockTrips[0].end_date}`,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should delete a trip when the delete button is clicked", async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <TripListPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    // Click the delete button for the first trip
    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText(DELETE_TRIP_BUTTON_LABEL);
      fireEvent.click(deleteButtons[0]);
    });

    // Verify the trip is no longer displayed
    await waitFor(() => {
      expect(screen.queryByText(mockTrips[0].name)).not.toBeInTheDocument();
      expect(
        screen.queryByText(mockTrips[0].destination),
      ).not.toBeInTheDocument();
    });
  });

  it("should load and display trips", async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <TripListPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    // Verify the trips are displayed
    await waitFor(() => {
      expect(screen.getByText(mockTrips[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockTrips[1].name)).toBeInTheDocument();
    });
  });

  it("should display a message when no trips are found", async () => {
    vi.mocked(getTrips).mockResolvedValue({ data: [], error: undefined });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <TripListPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    // Verify the message is displayed
    await waitFor(() => {
      expect(screen.getByText(NO_TRIPS_TEXT)).toBeInTheDocument();
    });
  });

  it("should display a friendly error message if trips cannot be loaded", async () => {
    // Mock console to suppress error messages in the test output
    vi.spyOn(console, "error").mockImplementation(() => {
      return;
    });
    // Mock the getTrips function to return an error
    vi.mocked(getTrips).mockResolvedValue({
      data: undefined,
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <ToastContext.Provider value={mockToastContextValue}>
            <TripListPage />
          </ToastContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    // Verify the error message is displayed
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        "error",
        FRIENDLY_ERROR_MESSAGES.general,
      );
    });
  });

  it("should render nothing if the user is not authenticated (redirect to Login Page implemented by TripsLayout)", () => {
    // Mock console to suppress error messages in the test output
    vi.spyOn(console, "error").mockImplementation(() => {
      return;
    });

    const { container } = render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
          <TripListPage />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    // Verify nothing is rendered
    expect(container.innerHTML).toBe("");
  });
});
