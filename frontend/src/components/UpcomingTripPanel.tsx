import { Trip } from "../models/Trip";
import pluralize from "pluralize";

export function UpcomingTripPanel({ trip }: { trip: Trip | null }) {
  if (!trip) {
    return (
      <>
        <p>No upcoming trips</p>
      </>
    );
  }

  const bookedFlightCount = trip.getBookedFlightCount();
  const bookedCarRentalCount = trip.getBookedCarRentalCount();

  return (
    <>
      <h2>{trip.name}</h2>
      {trip.startDate ? <p>{trip.getDaysUntilTripStarts()} days away</p> : null}
      {trip.startCity ? <p>{trip.startCity}</p> : null}
      {trip.endCity ? <p>{trip.endCity}</p> : null}
      <p>
        {bookedFlightCount
          ? `${bookedFlightCount} ${pluralize("flight", bookedFlightCount)} booked`
          : `No flights`}
      </p>
      <p>
        {bookedCarRentalCount
          ? `${bookedCarRentalCount} car ${pluralize("rental", bookedCarRentalCount)} booked`
          : `No car rentals`}
      </p>
    </>
  );
}
