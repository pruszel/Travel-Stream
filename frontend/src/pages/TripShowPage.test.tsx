// frontend/src/pages/TripShowPage.test.tsx

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";

import { AuthContext } from "@/contexts/authContext";
import { deleteTrip, getTrip, getTrips } from "@/utils/tripService";
import {
  mockAddToast,
  mockAuthContextLoggedIn,
  mockAuthContextLoggedOut,
  mockToastContextValue,
  mockTrip,
  mockTrips,
} from "@/test-utils";
import {
  DELETE_BUTTON_TEXT,
  EDIT_BUTTON_TEXT,
  TripShowPage,
} from "@/pages/TripShowPage";
import { ToastContext } from "@/contexts/toastContext";
import {
  FRIENDLY_ERROR_MESSAGES,
  TRIP_DELETED_SUCCESS_MESSAGE,
} from "@/constants";
import { TripEditPage } from "@/pages/TripEditPage";
import { PAGE_HEADER, TripListPage } from "@/pages/TripListPage";
import { NOT_FOUND_PAGE_HEADER, NotFoundPage } from "@/pages/NotFoundPage";

// Mock tripService
vi.mock("@/utils/tripService", () => ({
  getTrip: vi.fn(),
  getTrips: vi.fn(),
  deleteTrip: vi.fn(),
}));

/**
 * TripShowPage tests
 */
describe("<TripShowPage />", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();

    //
    // Default return value for mocked functions
    //
    // Successfully fetched trip details
    vi.mocked(getTrip).mockResolvedValue({
      data: mockTrip,
      error: undefined,
    });
    // Successfully fetched trips
    vi.mocked(getTrips).mockResolvedValue({
      data: mockTrips,
      error: undefined,
    });
    // Successfully deleted trip
    vi.mocked(deleteTrip).mockResolvedValue({
      data: undefined,
      error: undefined,
    });
    // Confirm dialog returns true
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("should display the trip details when the page loads", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/1"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id" element={<TripShowPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
      expect(screen.getByText(mockTrip.destination)).toBeInTheDocument();
      expect(screen.getByText(mockTrip.description)).toBeInTheDocument();
      expect(
        screen.getByText(`${mockTrip.start_date} - ${mockTrip.end_date}`),
      ).toBeInTheDocument();
    });
  });

  it("should display an error message if trip details cannot be loaded", async () => {
    // Mock console.error to suppress error messages in the test output
    vi.spyOn(console, "error").mockImplementation(() => {
      return;
    });
    // Mock an error when getting the trip details
    vi.mocked(getTrip).mockResolvedValue({
      data: undefined,
      error: {
        type: "general",
        message: FRIENDLY_ERROR_MESSAGES.general,
      },
    });

    render(
      <MemoryRouter initialEntries={["/trips/1"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <ToastContext.Provider value={mockToastContextValue}>
            <Routes>
              <Route path="/trips/:id" element={<TripShowPage />} />
            </Routes>
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Verify that the addToast function was called with the error message
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        "error",
        FRIENDLY_ERROR_MESSAGES.general,
      );
    });
  });

  it("should delete the trip when the delete button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/1"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <ToastContext.Provider value={mockToastContextValue}>
            <Routes>
              <Route path="/trips/:id" element={<TripShowPage />} />
              <Route path="/trips" element={<TripListPage />} />
            </Routes>
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Click the delete button
    await waitFor(() => {
      const deleteButton = screen.getByText(DELETE_BUTTON_TEXT);
      fireEvent.click(deleteButton);
    });

    // Verify that the trip was deleted and a toast was shown
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        "success",
        TRIP_DELETED_SUCCESS_MESSAGE,
      );
    });
  });

  it("should redirect to TripListPage when the trip is successfully deleted", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/1"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id" element={<TripShowPage />} />
            <Route path="/trips" element={<TripListPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Click the delete button
    await waitFor(() => {
      const deleteButton = screen.getByText(DELETE_BUTTON_TEXT);
      fireEvent.click(deleteButton);
    });

    // Verify that the TripListPage is displayed
    await waitFor(() => {
      expect(screen.getByText(PAGE_HEADER)).toBeInTheDocument();
    });
  });

  it("should redirect to TripEditPage when the edit button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/1"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id" element={<TripShowPage />} />
            <Route path="/trips/:id/edit" element={<TripEditPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Click the edit button
    await waitFor(() => {
      const editButton = screen.getByText(EDIT_BUTTON_TEXT);
      fireEvent.click(editButton);
    });

    // Verify the TripEditPage is displayed
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockTrip.name)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(mockTrip.destination),
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(mockTrip.description),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockTrip.start_date)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockTrip.end_date)).toBeInTheDocument();
    });
  });

  it("should redirect to 404 page when no trip ID is given in URL param", async () => {
    // Mock console.error to suppress error messages in the test output
    vi.spyOn(console, "error").mockImplementation(() => {
      return;
    });

    render(
      <MemoryRouter initialEntries={["/trip/no-id"]}>
        <Routes>
          <Route path="/trip/no-id" element={<TripShowPage />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(NOT_FOUND_PAGE_HEADER)).toBeInTheDocument();
    });
  });

  it("should render nothing if the user is not logged in", () => {
    // Mock console.error to suppress error messages in the test output
    vi.spyOn(console, "error").mockImplementation(() => {
      return;
    });

    const { container } = render(
      <MemoryRouter initialEntries={["/trips/1"]}>
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
          <Routes>
            <Route path="/trips/:id" element={<TripShowPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(container.innerHTML).toBe("");
  });
});
