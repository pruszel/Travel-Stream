import { describe, test, expect } from "vitest";
import { Trip } from "./Trip";

describe("Trip", () => {
  test("it returns the trip name", () => {
    const mockTrip: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(mockTrip.name).toBe("Trip to Paris");
  });

  test("it returns the start date", () => {
    const mockTrip: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: new Date("2023-10-01"),
    });
    expect(mockTrip.startDate).toEqual(new Date("2023-10-01"));
  });

  test("it returns the start city name", () => {
    const mockTrip: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      startCity: "New York",
    });
    expect(mockTrip.startCity).toBe("New York");
  });

  test("it returns the end city name", () => {
    const mockTrip: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      endCity: "Paris",
    });
    expect(mockTrip.endCity).toBe("Paris");
  });

  test("it returns the number of days until trip starts", () => {
    const mockTripWithNoStartDate: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(mockTripWithNoStartDate.getDaysUntilTripStarts()).toBe(null);

    const mockTripWithUndefinedTimezone: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    });
    expect(mockTripWithUndefinedTimezone.getDaysUntilTripStarts()).toBe(7);

    // TODO: add tests for trips with the same and different timezones from the user's current timezone
  });

  test("it returns the number of booked flights", () => {
    const mockTripWithNoFlights: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(mockTripWithNoFlights.getBookedFlightCount()).toBe(0);

    const mockTripWithOneBookedFlight: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      flights: [
        {
          id: "1",
          departureDate: new Date(),
          arrivalDate: new Date(),
          departureAirport: {
            code: "JFK",
            name: "John F. Kennedy International Airport",
            city: "New York",
            country: "United States",
          },
          departureTimezone: "America/New_York",
          arrivalAirport: {
            code: "LAX",
            name: "Los Angeles International Airport",
            city: "Los Angeles",
            country: "United States",
          },
          arrivalTimezone: "America/Los_Angeles",
          booked: true,
        },
      ],
    });
    expect(mockTripWithOneBookedFlight.getBookedFlightCount()).toBe(1);

    const mockTripWithOneNonBookedFlight: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      flights: [
        {
          id: "1",
          departureDate: new Date(),
          arrivalDate: new Date(),
          departureAirport: {
            code: "JFK",
            name: "John F. Kennedy International Airport",
            city: "New York",
            country: "United States",
          },
          departureTimezone: "America/New_York",
          arrivalAirport: {
            code: "LAX",
            name: "Los Angeles International Airport",
            city: "Los Angeles",
            country: "United States",
          },
          arrivalTimezone: "America/Los_Angeles",
          booked: false,
        },
      ],
    });
    expect(mockTripWithOneNonBookedFlight.getBookedFlightCount()).toBe(0);

    const mockTripWithOneBookedAndOneNonBookedFlight: Trip = new Trip({
      name: "Trip to Paris",
      id: "1",
      ownerId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      flights: [
        {
          id: "1",
          departureDate: new Date(),
          arrivalDate: new Date(),
          departureAirport: {
            code: "JFK",
            name: "John F. Kennedy International Airport",
            city: "New York",
            country: "United States",
          },
          departureTimezone: "America/New_York",
          arrivalAirport: {
            code: "LAX",
            name: "Los Angeles International Airport",
            city: "Los Angeles",
            country: "United States",
          },
          arrivalTimezone: "America/Los_Angeles",
          booked: true,
        },
        {
          id: "2",
          departureDate: new Date(),
          arrivalDate: new Date(),
          departureAirport: {
            code: "JFK",
            name: "John F. Kennedy International Airport",
            city: "New York",
            country: "United States",
          },
          departureTimezone: "America/New_York",
          arrivalAirport: {
            code: "LAX",
            name: "Los Angeles International Airport",
            city: "Los Angeles",
            country: "United States",
          },
          arrivalTimezone: "America/Los_Angeles",
          booked: false,
        },
      ],
    });
    expect(
      mockTripWithOneBookedAndOneNonBookedFlight.getBookedFlightCount(),
    ).toBe(1);
  });
});
