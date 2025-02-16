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
}
