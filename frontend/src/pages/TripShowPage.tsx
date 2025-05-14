// frontend/src/pages/TripShowPage.tsx

import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import { getTrip, deleteTrip, Trip } from "@/utils/tripService";
import { ToastContext } from "@/contexts/toastContext";
import { BackButton } from "@/components/BackButton";
import { AuthContext } from "@/contexts/authContext";
import { trackEvent } from "@/lib/firebase";
import {
  FRIENDLY_ERROR_MESSAGES,
  TRIP_DELETED_SUCCESS_MESSAGE,
} from "@/constants";

export const DELETE_BUTTON_TEXT = "Delete";
export const EDIT_BUTTON_TEXT = "Edit Trip";

export function TripShowPage() {
  const { addToast } = useContext(ToastContext);
  const { firebaseUser, isAuthStateLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id: idParam } = useParams();

  // Serve 404 if no trip ID is given in the URL
  useEffect(() => {
    if (!idParam) {
      console.error("Trip ID parameter is missing in the URL.");
      void navigate("/404", { replace: true });
    }
  }, [idParam, navigate]);

  const tripId = parseInt(idParam ?? "");
  const [tripDetails, setTripDetails] = useState<Trip | null>(null);

  // Fetch trip details from the api
  useEffect(() => {
    const handleLoadingTripDetails = async () => {
      if (!firebaseUser) return; // TODO: refactor this: 1) add console.error message 2) reduce duplicated code in all trip pages
      const token = await firebaseUser.getIdToken();
      const response = await getTrip(token, tripId);
      if (response.data) {
        setTripDetails(response.data);
      } else if (response.error) {
        console.error("Error loading trip details: ", response.error.message);
        addToast("error", FRIENDLY_ERROR_MESSAGES.general);
      }
    };

    void handleLoadingTripDetails();
  }, [firebaseUser, setTripDetails, tripId, addToast]);

  if (!isAuthStateLoading && !firebaseUser) {
    console.error(
      "Error while rendering TripShowPage: No Firebase user found.",
    );
  }
  if (!firebaseUser) return null;

  return (
    <>
      <TripDetailsHeader tripDetails={tripDetails} />
      <TripDetails tripDetails={tripDetails} />
    </>
  );
}

interface TripDetailsHeaderProps {
  tripDetails: Trip | null;
}

function TripDetailsHeader({ tripDetails }: TripDetailsHeaderProps) {
  const { firebaseUser } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  if (!tripDetails || !firebaseUser) return null;

  const handleDeleteTripButtonClick = () => {
    const confirmDelete = confirm(
      `Are you sure you want to delete this trip? This action cannot be undone.`,
    );
    if (!confirmDelete) {
      return;
    }

    async function handleTripDeletion() {
      if (!tripDetails || !firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      const response = await deleteTrip(token, tripDetails.id);

      if (!response.error) {
        addToast("success", TRIP_DELETED_SUCCESS_MESSAGE);
        void trackEvent("delete_trip", { source: "show_page" });
        void navigate("/trips");
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
          <h2 className="text-2xl font-bold">{tripDetails.name}</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn self-start"
              onClick={() => {
                void navigate(`/trips/${tripDetails.id.toString()}/edit`);
              }}
            >
              {EDIT_BUTTON_TEXT}
            </button>
            <button
              type="button"
              className="btn btn-soft btn-error"
              onClick={handleDeleteTripButtonClick}
            >
              {DELETE_BUTTON_TEXT}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface TripDetailsProps {
  tripDetails: Trip | null;
}

function TripDetails({ tripDetails }: TripDetailsProps) {
  const { firebaseUser } = useContext(AuthContext);

  if (!tripDetails || !firebaseUser) return null;

  const daysUntilEndDate = useMemo(
    () =>
      Math.floor(
        (new Date(tripDetails.end_date).getTime() - new Date().getTime()) /
          (1000 * 3600 * 24),
      ),
    [tripDetails],
  );

  const daysUntilStartDate = useMemo(
    () =>
      Math.floor(
        (new Date(tripDetails.start_date).getTime() - new Date().getTime()) /
          (1000 * 3600 * 24),
      ),
    [tripDetails],
  );

  return (
    <>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold">{tripDetails.destination}</h3>

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
          {tripDetails.start_date} - {tripDetails.end_date}
        </p>
        <p>{tripDetails.description}</p>
      </div>
    </>
  );
}
