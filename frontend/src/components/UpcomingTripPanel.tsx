import { Trip } from "../models/Trip";

export function UpcomingTripPanel({ trip }: { trip: Trip | null }) {
  if (!trip) {
    return (
      <>
        <p>No upcoming trips</p>
      </>
    );
  }

  return (
    <>
      <h2>{trip.name}</h2>
      {trip.startDate ? <p>{trip.getDaysUntilTripStarts()} days away</p> : null}
      {trip.startCity ? <p>{trip.startCity}</p> : null}
      {trip.endCity ? <p>{trip.endCity}</p> : null}
    </>
  );
}
