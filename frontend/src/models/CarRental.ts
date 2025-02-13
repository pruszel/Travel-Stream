export type CarRentalData = {
  id: string;
  booked: boolean;
  company: string;
  pickUpDate?: Date;
  dropOffDate?: Date;
  pickUpLocation: string;
  dropOffLocation: string;
  carMake?: string;
  carModel?: string;
  carYear?: string;
  carColor?: string;
  pricePerDay?: number;
  totalPrice?: number;
  currency?: string;
};
