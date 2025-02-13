export type AirportData = {
  code: string;
  name: string;
  city: string;
  country: string;
};

export type FlightData = {
  id: string;
  booked: boolean;
  airline?: string;
  flightNumber?: string;
  confirmationNumber?: string;
  departureDate: Date;
  departureTimezone: string;
  arrivalDate: Date;
  arrivalTimezone: string;
  departureAirport?: AirportData;
  arrivalAirport?: AirportData;
  departureTerminal?: string;
  arrivalTerminal?: string;
  departureGate?: string;
  arrivalGate?: string;
  class?: string;
  price?: number;
  currency?: string;
};
