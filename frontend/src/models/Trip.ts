import { differenceInDays } from "date-fns";
import { CarRentalData } from "./CarRental";
import { FlightData } from "./Flight";
import { HotelData } from "./Hotel";

export type BudgetData = {
  estimated?: number;
  actual?: number;
  currency?: string;
};

export type PetCareData = {
  needed: boolean;
  arranged: boolean;
  icon: "cat" | "dog" | "fish" | "bird" | "reptile" | "other";
};

export type TripData = {
  id: string;
  name: string;
  description?: string;
  startDate?: Date;
  startTimezone?: string;
  endDate?: Date;
  endTimezone?: string;
  startCity?: string;
  endCity?: string;
  flights?: FlightData[];
  carRentals?: CarRentalData[];
  hotels?: HotelData[];
  petCare?: PetCareData;
  budget?: BudgetData;
  ownerId: string;
  collaboratorIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export class Trip {
  private data: TripData;

  constructor(data: TripData) {
    this.data = data;
  }

  get name() {
    return this.data.name;
  }

  get startDate() {
    return this.data.startDate;
  }

  get startCity() {
    return this.data.startCity;
  }

  get endCity() {
    return this.data.endCity;
  }

  // TODO: incorporate the user's current timezone and the trip's start timezone into the calculation of days until the trip starts
  getDaysUntilTripStarts() {
    if (!this.data.startDate) return null;
    return differenceInDays(this.data.startDate, new Date());
  }

  getBookedFlightCount() {
    return this.data.flights?.filter((flight) => flight.booked).length || 0;
  }

  getBookedCarRentalCount() {
    return (
      this.data.carRentals?.filter((carRental) => carRental.booked).length || 0
    );
  }
}
