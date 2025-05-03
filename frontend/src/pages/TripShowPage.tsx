// frontend/src/pages/TripShowPage.tsx

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  FRIENDLY_ERROR_MESSAGES,
  getTrip,
  deleteTrip,
  Trip,
} from "@/utils/tripService.ts";
import { ToastContext } from "@/contexts/toastContext.ts";
import { BackButton } from "@/components/BackButton.tsx";
import { AuthContext } from "@/contexts/authContext.ts";

export function TripShowPage() {
  const { addToast } = useContext(ToastContext);
  const { firebaseUser } = useContext(AuthContext);
  const { id: idParam } = useParams();
  if (!idParam) {
    throw new Error("Trip ID is required");
  }
  const tripId = parseInt(idParam);
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const handleLoadingTripDetails = async () => {
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      const response = await getTrip(token, tripId);
      if (response.data) {
        setTrip(response.data);
      } else if (response.error) {
        console.error("Error loading trip details: ", response.error.message);
        addToast("error", FRIENDLY_ERROR_MESSAGES.general);
      }
    };

    void handleLoadingTripDetails();
  }, [firebaseUser, setTrip, tripId, addToast]);

  return (
    <>
      <TripDetailsHeader trip={trip} />
      <TripDetails trip={trip} />
    </>
  );
}

interface TripDetailsHeaderProps {
  trip: Trip | null;
}

function TripDetailsHeader({ trip }: TripDetailsHeaderProps) {
  const { firebaseUser } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  if (!trip || !firebaseUser) return null;

  const handleEditTripButtonClick = () => {
    async function navigateToTripEditPage() {
      if (!trip) return;
      await navigate(`/trips/${trip.id.toString()}/edit`);
    }

    void navigateToTripEditPage();
  };

  const handleDeleteTripButtonClick = () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete this trip? This action cannot be undone.`,
    );
    if (!confirmDelete) {
      return;
    }

    async function handleTripDeletion() {
      if (!trip || !firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      const response = await deleteTrip(token, trip.id);

      if (!response.error) {
        addToast("success", "Trip deleted successfully.");
        await navigate("/trips");
      } else {
        console.error("Error deleting trip: ", response.error.message);
        addToast("error", FRIENDLY_ERROR_MESSAGES.general);
      }
    }

    void handleTripDeletion();
  };

  return (
    <>
      <div className="flex justify-start pb-8">
        <BackButton path={"/trips"} />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between gap-4">
          <h2 className="text-2xl font-bold">{trip.name}</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn self-start"
              onClick={handleEditTripButtonClick}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-soft btn-error"
              onClick={handleDeleteTripButtonClick}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface TripDetailsProps {
  trip: Trip | null;
}

function TripDetails({ trip }: TripDetailsProps) {
  const { firebaseUser } = useContext(AuthContext);

  if (!trip || !firebaseUser) return null;

  const daysUntilStartDate = Math.floor(
    (new Date(trip.start_date).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24),
  );

  const daysUntilEndDate = Math.floor(
    (new Date(trip.end_date).getTime() - new Date().getTime()) /
      (1000 * 3600 * 24),
  );

  return (
    <>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold">{trip.destination}</h3>

        {daysUntilStartDate < 0 && daysUntilEndDate < 0 && (
          <p className="text-gray-700 dark:text-gray-400">Trip passed</p>
        )}
        {daysUntilStartDate < 0 && daysUntilEndDate > 0 && (
          <p className="text-gray-700 dark:text-gray-400">Travel On!</p>
        )}
        {daysUntilStartDate == 0 && (
          <p className={"text-primary font-bold"}>Today</p>
        )}
        {daysUntilStartDate == 1 && (
          <p className={"text-primary font-bold"}>Tomorrow</p>
        )}
        {daysUntilStartDate > 1 && (
          <p
            className={"text-primary font-bold"}
          >{`${daysUntilStartDate.toString()} until trip`}</p>
        )}

        <p>
          {trip.start_date} - {trip.end_date}
        </p>
        <p>{trip.description}</p>
      </div>
    </>
  );
}
