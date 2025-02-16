import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UpcomingTripPanel } from "./UpcomingTripPanel";
import { Trip } from "../models/Trip";

describe("UpcomingTripPanel", () => {
  test("displays the trip name", () => {
    const mockTrip: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      startDate: new Date(),
      endDate: new Date(),
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    render(<UpcomingTripPanel trip={mockTrip} />);
    expect(screen.getByText("Trip to Paris")).toBeDefined();
  });

  test("displays a message when no trip provided", () => {
    render(<UpcomingTripPanel trip={null} />);
    expect(screen.getByText("No upcoming trips")).toBeDefined();
  });
});
