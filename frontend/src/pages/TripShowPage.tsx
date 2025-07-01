// frontend/src/pages/TripShowPage.tsx

import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import { getTrip, deleteTrip, Trip } from "@/utils/tripService";
import { ToastContext } from "@/contexts/toastContext";
import { BackButton } from "@/components/BackButton";
import { trackEvent } from "@/lib/firebase";
import {
  FRIENDLY_ERROR_MESSAGES,
  TRIP_DELETED_SUCCESS_MESSAGE,
} from "@/constants";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export const DELETE_BUTTON_TEXT = "Delete";
export const EDIT_BUTTON_TEXT = "Edit Trip";

export function TripShowPage() {
  const { addToast } = useContext(ToastContext);
  const { firebaseUser } = useRequireAuth();
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState<Trip | null>(null);
  const [isTripLoading, setIsTripLoading] = useState(true);

  // Load 404 page if no trip ID is given in the URL
  const { id: idParam } = useParams();
  const tripId = parseInt(idParam ?? "");
  useEffect(() => {
    if (!tripId) {
      console.error("Trip ID parameter is missing in the URL.");
      void navigate("/404", { replace: true });
    }
  }, [tripId, navigate]);

  // Fetch trip details from the API
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!firebaseUser) return;

      try {
        setIsTripLoading(true);
        const token = await firebaseUser.getIdToken();
        const response = await getTrip(token, tripId);

        if (response.data) {
          setTripDetails(response.data);
          setIsTripLoading(false);
        } else if (response.error) {
          console.error("Error loading trip details: ", response.error.message);
          addToast("error", FRIENDLY_ERROR_MESSAGES.general);
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
        addToast("error", FRIENDLY_ERROR_MESSAGES.general);
      } finally {
      }
    };

    void fetchTripDetails();
  }, [firebaseUser, tripId, addToast]);

  return (
    <>
      <TripDetailsHeader
        tripDetails={tripDetails}
        isTripLoading={isTripLoading}
      />
      <TripDetails tripDetails={tripDetails} isTripLoading={isTripLoading} />
    </>
  );
}

interface TripDetailsHeaderProps {
  tripDetails: Trip | null;
  isTripLoading: boolean;
}

function TripDetailsHeader({
  tripDetails,
  isTripLoading,
}: TripDetailsHeaderProps) {
  const { firebaseUser } = useRequireAuth();
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleDeleteTripButtonClick = async () => {
    if (!tripDetails || !firebaseUser) return;

    const confirmDelete = confirm(
      `Are you sure you want to delete this trip? This action cannot be undone.`,
    );
    if (!confirmDelete) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await deleteTrip(token, tripDetails.id);

      if (!response.error) {
        addToast("success", TRIP_DELETED_SUCCESS_MESSAGE);
        void trackEvent("delete_trip", { source: "show_page" });
        void navigate("/trips");
      } else {
        throw new Error(response.error.message);
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      addToast("error", FRIENDLY_ERROR_MESSAGES.general);
    }
  };

  // Show skeleton when loading
  if (isTripLoading) {
    return (
      <>
        <div className="flex justify-start pb-8">
          <BackButton path={"/trips"} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between gap-4">
            <h2 className="skeleton h-8 w-48"></h2>
            <div className="flex gap-2">
              <div className="skeleton h-8 w-20"></div>
              <div className="skeleton h-8 w-16"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Return null if no trip details
  if (!tripDetails) return null;

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
              className="btn btn-sm self-start"
              onClick={() => {
                void navigate(`/trips/${tripDetails.id.toString()}/edit`);
              }}
            >
              {EDIT_BUTTON_TEXT}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-soft btn-error"
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
  isTripLoading: boolean;
}

function TripDetails({ tripDetails, isTripLoading }: TripDetailsProps) {
  const daysUntilEndDate = useMemo(
    () =>
      !tripDetails
        ? 0
        : Math.floor(
            (new Date(tripDetails.end_date).getTime() - new Date().getTime()) /
              (1000 * 3600 * 24),
          ),
    [tripDetails],
  );

  const daysUntilStartDate = useMemo(
    () =>
      !tripDetails
        ? 0
        : Math.floor(
            (new Date(tripDetails.start_date).getTime() -
              new Date().getTime()) /
              (1000 * 3600 * 24),
          ),
    [tripDetails],
  );

  // Show skeleton when loading
  if (isTripLoading) {
    return (
      <section className="flex flex-col gap-2">
        <div className="skeleton h-6 w-32 mb-2"></div>
        <div className="skeleton h-5 w-24 mb-2"></div>
        <div className="skeleton h-5 w-48 mb-2"></div>
        <div className="skeleton h-20 w-full"></div>
      </section>
    );
  }

  // Return null if no trip details
  if (!tripDetails) return null;

  return (
    <>
      <section className="flex flex-col gap-2">
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
      </section>
    </>
  );
}
