import { describe, test, expect } from "vitest";
import { Trip } from "./Trip";

describe("Trip", () =>
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
  }));
