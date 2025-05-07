// frontend/src/pages/TripEditPage.test.tsx

import { describe, it, beforeEach, vi, expect } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";

import { getTrip, updateTrip } from "@/utils/tripService";
import {
  mockAuthContextLoggedOut,
  mockAddToast,
  mockAuthContextLoggedIn,
  mockGetIdToken,
  mockToastContextValue,
  mockTrip,
  mockUpdatedTrip,
} from "@/test-utils";
import { AuthContext } from "@/contexts/authContext";
import { TripShowPage } from "@/pages/TripShowPage";
import {
  TRIP_EDIT_PAGE_CANCEL_BUTTON_TEXT,
  TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME,
  TRIP_UPDATE_SUCCESS_MESSAGE,
  TripEditPage,
} from "./TripEditPage";
import { FRIENDLY_ERROR_MESSAGES } from "@/constants.ts";
import { ToastContext } from "@/contexts/toastContext";

// Mock tripService
vi.mock("@/utils/tripService", () => ({
  getTrip: vi.fn(),
  updateTrip: vi.fn(),
}));

/**
 * TripEditPage tests
 */
describe("<TripEditPage />", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();

    //
    // Default return value for mocked functions
    //
    // Successfully get the trip details
    vi.mocked(getTrip).mockResolvedValue({
      data: mockTrip,
      error: undefined,
    });
    // Successfully update trip
    vi.mocked(updateTrip).mockResolvedValue({
      data: mockTrip,
      error: undefined,
    });
    vi.mocked(mockGetIdToken).mockResolvedValue("fake-token");
  });

  it("should display the trip details in form inputs when the page loads", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id/edit" element={<TripEditPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Find form inputs and verify their values
    const nameInput = await screen.findByDisplayValue(mockTrip.name);
    const destinationInput = await screen.findByDisplayValue(
      mockTrip.destination,
    );
    const descriptionInput = await screen.findByDisplayValue(
      mockTrip.description,
    );
    const startDateInput = await screen.findByDisplayValue(mockTrip.start_date);
    const endDateInput = await screen.findByDisplayValue(mockTrip.end_date);

    expect(nameInput).toBeInTheDocument();
    expect(destinationInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  it("should update the trip when the form is submitted", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id" element={<TripShowPage />} />
            <Route path="/trips/:id/edit" element={<TripEditPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Fill out and submit the form
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText("Trip Name"), {
        target: { value: mockUpdatedTrip.name },
      });
      fireEvent.change(screen.getByLabelText("Destination"), {
        target: { value: mockUpdatedTrip.destination },
      });
      fireEvent.change(screen.getByLabelText("Description"), {
        target: { value: mockUpdatedTrip.description },
      });
      fireEvent.change(screen.getByLabelText("Start Date"), {
        target: { value: mockUpdatedTrip.start_date },
      });
      fireEvent.change(screen.getByLabelText("End Date"), {
        target: { value: mockUpdatedTrip.end_date },
      });

      fireEvent.submit(
        screen.getByRole("form", { name: TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME }),
      );
    });

    // Verify that updateTrip was called with the correct data
    await waitFor(() => {
      expect(vi.mocked(updateTrip)).toHaveBeenCalledWith(
        "fake-token",
        1,
        mockUpdatedTrip,
      );
    });
  });

  it("should navigate to the trip details page after successful update", async () => {
    // Mock getting the trip details once on initial load and once after update
    vi.mocked(getTrip)
      .mockResolvedValueOnce({
        data: mockTrip,
        error: undefined,
      })
      .mockResolvedValueOnce({
        data: mockUpdatedTrip,
        error: undefined,
      });

    render(
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id" element={<TripShowPage />} />
            <Route path="/trips/:id/edit" element={<TripEditPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Submit the form
    await waitFor(() => {
      fireEvent.submit(
        screen.getByRole("form", { name: TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME }),
      );
    });

    // Verify trip details page is displayed with new trip data
    await waitFor(() => {
      expect(screen.getByText(mockUpdatedTrip.name)).toBeInTheDocument();
      expect(screen.getByText(mockUpdatedTrip.destination)).toBeInTheDocument();
      expect(screen.getByText(mockUpdatedTrip.description)).toBeInTheDocument();
      expect(
        screen.getByText(
          `${mockUpdatedTrip.start_date} - ${mockUpdatedTrip.end_date}`,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should navigate to the trip details page when the cancel button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id" element={<TripShowPage />} />
            <Route path="/trips/:id/edit" element={<TripEditPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Click cancel button
    await waitFor(() => {
      fireEvent.click(
        screen.getByRole("button", { name: TRIP_EDIT_PAGE_CANCEL_BUTTON_TEXT }),
      );
    });

    // Verify navigation to trip details page
    await waitFor(() => {
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
      expect(screen.getByText(mockTrip.destination)).toBeInTheDocument();
      expect(screen.getByText(mockTrip.description)).toBeInTheDocument();
      expect(
        screen.getByText(`${mockTrip.start_date} - ${mockTrip.end_date}`),
      ).toBeInTheDocument();
    });
  });

  it("should display an error message if the trip update fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {
      return;
    });
    vi.mocked(updateTrip).mockResolvedValue({
      data: undefined,
      error: { type: "general", message: "Error updating trip" },
    });

    render(
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <ToastContext.Provider value={mockToastContextValue}>
            <Routes>
              <Route path="/trips/:id/edit" element={<TripEditPage />} />
            </Routes>
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Submit form
    await waitFor(() => {
      fireEvent.submit(
        screen.getByRole("form", { name: TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME }),
      );
    });

    // Verify error message is displayed
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        "error",
        FRIENDLY_ERROR_MESSAGES.general,
      );
    });
  });

  it("should display a success message after successful update", async () => {
    render(
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={mockAuthContextLoggedIn}>
          <ToastContext.Provider value={mockToastContextValue}>
            <Routes>
              <Route path="/trips/:id" element={<TripShowPage />} />
              <Route path="/trips/:id/edit" element={<TripEditPage />} />
            </Routes>
          </ToastContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Submit form
    await waitFor(() => {
      fireEvent.submit(
        screen.getByRole("form", {
          name: TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME,
        }),
      );
    });

    // Verify success message is displayed
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        "success",
        TRIP_UPDATE_SUCCESS_MESSAGE,
      );
    });
  });

  it("should render nothing if the user is not authenticated (redirect to Login Page handled by TripsLayout)", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={mockAuthContextLoggedOut}>
          <Routes>
            <Route path="/trips/:id/edit" element={<TripEditPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Verify the page renders nothing
    await waitFor(() => {
      expect(container.innerHTML).toBe("");
    });
  });
});
