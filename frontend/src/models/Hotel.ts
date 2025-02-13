export type HotelData = {
  id: string;
  booked: boolean;
  name: string;
  checkIn?: Date;
  checkOut?: Date;
  numBeds?: number;
  roomType?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  amenities: {
    hasPool: boolean;
    hasGym: boolean;
    hasBreakfast: boolean;
    hasParking: boolean;
  };
  pricePerNight?: number;
  totalPrice?: number;
  currency?: string;
  confirmationNumber?: string;
};
