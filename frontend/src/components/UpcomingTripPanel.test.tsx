import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { UpcomingTripPanel } from "./UpcomingTripPanel";
import { Trip } from "../models/Trip";

describe("UpcomingTripPanel", () => {
  afterEach(async () => {
    cleanup();
  });

  test("displays the trip name", () => {
    const mockTrip = new Trip({
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

  test("displays the start city name and the end city name", () => {
    const mockTrip = new Trip({
      name: "Trip to Paris",
      id: "1",
      startDate: new Date(),
      endDate: new Date(),
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      startCity: "New York",
      endCity: "Paris",
    });
    render(<UpcomingTripPanel trip={mockTrip} />);
    expect(screen.getByText("New York")).toBeDefined();
    expect(screen.getByText("Paris")).toBeDefined();
  });

  test("displays the number of booked flights", () => {
    const mockTripWithNoBookedFlights = new Trip({
      name: "Trip to Paris",
      id: "1",
      startDate: new Date(),
      endDate: new Date(),
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    render(<UpcomingTripPanel trip={mockTripWithNoBookedFlights} />);
    expect(screen.getByText("No flights")).toBeDefined();
    cleanup();

    const mockTripWithOneBookedFlight = new Trip({
      name: "Trip to Paris",
      id: "1",
      startDate: new Date(),
      endDate: new Date(),
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      flights: [
        {
          id: "1",
          booked: true,
          departureDate: new Date(),
          departureTimezone: "America/Los_Angeles",
          arrivalDate: new Date(),
          arrivalTimezone: "America/Denver",
        },
      ],
    });
    render(<UpcomingTripPanel trip={mockTripWithOneBookedFlight} />);
    expect(screen.getByText("1 flight booked")).toBeDefined();

    const mockTripWithTwoBookedFlights = new Trip({
      name: "Trip to Paris",
      id: "1",
      startDate: new Date(),
      endDate: new Date(),
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      flights: [
        {
          id: "1",
          booked: true,
          departureDate: new Date(),
          departureTimezone: "America/Los_Angeles",
          arrivalDate: new Date(),
          arrivalTimezone: "America/Denver",
        },
        {
          id: "2",
          booked: false,
          departureDate: new Date(),
          departureTimezone: "America/Denver",
          arrivalDate: new Date(),
          arrivalTimezone: "America/New_York",
        },
        {
          id: "3",
          booked: true,
          departureDate: new Date(),
          departureTimezone: "America/New_York",
          arrivalDate: new Date(),
          arrivalTimezone: "Europe/Paris",
        },
      ],
    });
    render(<UpcomingTripPanel trip={mockTripWithTwoBookedFlights} />);
    expect(screen.getByText("2 flights booked")).toBeDefined();
  });

  test("displays the number of car rentals booked", () => {
    const mockTripWithNoCarRentals = new Trip({
      name: "Trip to Paris",
      id: "1",
      startDate: new Date(),
      endDate: new Date(),
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    render(<UpcomingTripPanel trip={mockTripWithNoCarRentals} />);
    expect(screen.getByText("No car rentals")).toBeDefined();

    const mockTripWithOneBookedCarRental = new Trip({
      name: "Trip to Paris",
      id: "1",
      startDate: new Date(),
      endDate: new Date(),
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      carRentals: [
        {
          id: "1",
          booked: true,
          company: "Hertz",
          pickUpDate: new Date(),
          dropOffDate: new Date(),
          pickUpLocation: "CDG",
          dropOffLocation: "CDG",
        },
        {
          id: "2",
          booked: false,
          company: "Enterprise",
          pickUpDate: new Date(),
          dropOffDate: new Date(),
          pickUpLocation: "CDG",
          dropOffLocation: "CDG",
        },
      ],
    });
    render(<UpcomingTripPanel trip={mockTripWithOneBookedCarRental} />);
    expect(screen.getByText("1 car rental booked")).toBeDefined();

    const mockTripWithTwoBookedCarRentals = new Trip({
      name: "Trip to Paris",
      id: "1",
      startDate: new Date(),
      endDate: new Date(),
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      carRentals: [
        {
          id: "1",
          booked: true,
          company: "Hertz",
          pickUpDate: new Date(),
          dropOffDate: new Date(),
          pickUpLocation: "CDG",
          dropOffLocation: "CDG",
        },
        {
          id: "2",
          booked: true,
          company: "Enterprise",
          pickUpDate: new Date(),
          dropOffDate: new Date(),
          pickUpLocation: "CDG",
          dropOffLocation: "CDG",
        },
      ],
    });
    render(<UpcomingTripPanel trip={mockTripWithTwoBookedCarRentals} />);
    expect(screen.getByText("2 car rentals booked")).toBeDefined();
  });

  test("displays the number of booked hotels or vacation rental nights", () => {});
});
