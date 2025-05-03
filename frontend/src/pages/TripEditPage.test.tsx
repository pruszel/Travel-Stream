// frontend/src/pages/TripEditPage.test.tsx

import { describe, it, beforeEach, vi, expect } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import {
  TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME,
  TripEditPage,
} from "./TripEditPage";
import { getTrip, Trip, updateTrip } from "@/utils/tripService.ts";
import { MemoryRouter, Routes, Route } from "react-router";
import { authContextLoggedIn } from "@/test-utils.tsx";
import { AuthContext } from "@/contexts/authContext";
import { TripShowPage } from "@/pages/TripShowPage.tsx";

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
    vi.clearAllMocks();
  });

  it("should display the trip details in form inputs when the page loads", async () => {
    const tripName = "Test Trip";
    const tripDestination = "Test Destination";
    const tripDescription = "This is a test trip";
    const tripStartDate = "2023-01-01";
    const tripEndDate = "2023-01-10";

    // Mock getting the trip details
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
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={authContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id/edit" element={<TripEditPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // Find form inputs and check their values
    const nameInput = await screen.findByDisplayValue(tripName);
    const destinationInput = await screen.findByDisplayValue(tripDestination);
    const descriptionInput = await screen.findByDisplayValue(tripDescription);
    const startDateInput = await screen.findByDisplayValue(tripStartDate);
    const endDateInput = await screen.findByDisplayValue(tripEndDate);

    expect(nameInput).toBeInTheDocument();
    expect(destinationInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
  });

  it("should update the trip when the form is submitted", async () => {
    // Mock successfully getting the trip details
    vi.mocked(getTrip).mockResolvedValue({
      data: {
        id: 1,
        name: "Test Trip",
        destination: "Test Destination",
        description: "This is a test trip",
        start_date: "2023-01-01",
        end_date: "2023-01-10",
      } as Trip,
      error: undefined,
    });

    // Mock updateTrip to return a successful response
    vi.mocked(updateTrip).mockResolvedValue({
      data: { id: 1 } as unknown as Trip,
      error: undefined,
    });

    render(
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={authContextLoggedIn}>
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
        target: { value: "Updated Trip Name" },
      });
      fireEvent.change(screen.getByLabelText("Destination"), {
        target: { value: "Updated Destination" },
      });
      fireEvent.change(screen.getByLabelText("Description"), {
        target: { value: "Updated description" },
      });
      fireEvent.change(screen.getByLabelText("Start Date"), {
        target: { value: "2023-02-01" },
      });
      fireEvent.change(screen.getByLabelText("End Date"), {
        target: { value: "2023-02-10" },
      });

      fireEvent.submit(
        screen.getByRole("form", { name: TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME }),
      );
    });

    // Verify that updateTrip was called with the correct data
    await waitFor(() => {
      expect(vi.mocked(updateTrip)).toHaveBeenCalledWith("fake-token", 1, {
        id: 1,
        name: "Updated Trip Name",
        destination: "Updated Destination",
        description: "Updated description",
        start_date: "2023-02-01",
        end_date: "2023-02-10",
      });
    });
  });

  it("should navigate to the trip details page after successful update", async () => {
    const tripName = "Test Trip";
    const tripDestination = "Test Destination";
    const tripDescription = "This is a test trip";
    const tripStartDate = "2023-01-01";
    const tripEndDate = "2023-01-10";

    // Mock trip details
    vi.mocked(getTrip).mockResolvedValue({
      data: {
        id: 1,
        name: tripName,
        destination: tripDestination,
        description: tripDescription,
        start_date: tripStartDate,
        end_date: tripEndDate,
      } as Trip,
      error: undefined,
    });

    // mock successful trip update
    vi.mocked(updateTrip).mockResolvedValue({
      data: { id: 1 } as unknown as Trip,
      error: undefined,
    });

    render(
      <MemoryRouter initialEntries={["/trips/1/edit"]}>
        <AuthContext.Provider value={authContextLoggedIn}>
          <Routes>
            <Route path="/trips/:id" element={<TripShowPage />} />
            <Route path="/trips/:id/edit" element={<TripEditPage />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    // submit the form
    await waitFor(() => {
      fireEvent.submit(
        screen.getByRole("form", { name: TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME }),
      );
    });

    // verify trip details page is displayed
    await waitFor(() => {
      expect(screen.getByText(tripName)).toBeInTheDocument();
      expect(screen.getByText(tripDestination)).toBeInTheDocument();
      expect(screen.getByText(tripDescription)).toBeInTheDocument();
      expect(
        screen.getByText(`${tripStartDate} - ${tripEndDate}`),
      ).toBeInTheDocument();
    });
  });

  it("should navigate to the trip details page when the cancel button is clicked", async () => {
    // TODO: mock getTrip to return trip details
    // TODO: render the TripEditPage
    // TODO: click cancel button
    // TODO: verify navigation to trip details page
  });

  it("should display an error message if the trip update fails", async () => {
    // TODO: mock updateTrip to return an error
    // TODO: mock addToast to verify error message
    // TODO: render the TripEditPage
    // TODO: submit form
    // TODO: verify error message is displayed
  });

  it("should display a success message after successful update", async () => {
    // TODO: mock updateTrip to return success
    // TODO: mock addToast to verify success message
    // TODO: render the TripEditPage
    // TODO: submit form
    // TODO: verify success message is displayed
  });
});
