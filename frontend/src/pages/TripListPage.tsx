// frontend/src/pages/TripListPage.tsx

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { Trash2 } from "lucide-react";

import { AuthContext } from "@/contexts/authContext";
import { ToastContext } from "@/contexts/toastContext";
import { deleteTrip, getTrips, Trip } from "@/utils/tripService";
import { trackEvent } from "@/lib/firebase";
import { FRIENDLY_ERROR_MESSAGES } from "@/constants";

export const PAGE_HEADER = "My Trips";
export const ADD_TRIP_BUTTON_TEXT = "Add Trip";
export const NO_TRIPS_TEXT = "No trips found.";
export const DELETE_TRIP_BUTTON_LABEL = "Delete trip";

const ERROR_MESSAGE_LOADING_TRIPS_NO_USER =
  "Error while loading user trips: No Firebase user found.";
const ERROR_MESSAGE_NO_USER =
  "Error while rendering TripListPage: No Firebase user found.";

export function TripListPage() {
  const { firebaseUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);

  // Load the user's trips when the user is authenticated
  useEffect(() => {
    const loadUserTrips = async () => {
      if (!firebaseUser) {
        // TODO: refactor this repeated logic in every trip page
        console.error(ERROR_MESSAGE_LOADING_TRIPS_NO_USER);
        return;
      }
      const token = await firebaseUser.getIdToken();
      if (!token) {
        // TODO: refactor this repeated logic in every trip page
        console.error("No Firebase token found for user: ", firebaseUser);
        addToast("error", FRIENDLY_ERROR_MESSAGES.general);
        return;
      }
      const response = await getTrips(token);
      if (response.data) {
        setUserTrips(response.data);
      } else if (response.error) {
        console.error("Error loading user trips: ", response.error.message);
        addToast("error", FRIENDLY_ERROR_MESSAGES.general);
      }
      return;
    };
    void loadUserTrips();
  }, [firebaseUser, addToast]);

  if (!firebaseUser) {
    console.error(ERROR_MESSAGE_NO_USER);
    return null;
  }

  return (
    <>
      <section>
        <div className="flex flex-col gap-4 sm:gap-0">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">{PAGE_HEADER}</h2>
            <button
              type="button"
              className="btn btn-primary self-end"
              onClick={() => {
                void navigate("/trips/new");
              }}
            >
              {ADD_TRIP_BUTTON_TEXT}
            </button>
          </div>
          <TripList userTrips={userTrips} setUserTrips={setUserTrips} />
        </div>
      </section>
    </>
  );
}

interface TripListProps {
  userTrips: Trip[];
  setUserTrips: Dispatch<SetStateAction<Trip[]>>;
}

function TripList({ userTrips, setUserTrips }: TripListProps) {
  const { firebaseUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);

  const handleDeleteTrip = useCallback(
    (tripId: number) => {
      if (!firebaseUser) return;

      const confirmDelete = confirm(
        `Are you sure you want to delete this trip? This action cannot be undone.`,
      );
      if (!confirmDelete) return;

      const handleTripDeletion = async () => {
        const token = await firebaseUser.getIdToken();
        const response = await deleteTrip(token, tripId);
        if (!response.error) {
          setUserTrips((prevTrips) => {
            return prevTrips.filter((trip) => trip.id !== tripId);
          });

          addToast("success", "Trip deleted successfully.");
          void trackEvent("delete_trip", { source: "list_page" });
        } else {
          console.error("Error deleting trip: ", response.error.message);
          addToast("error", response.error.message);
        }
      };

      void handleTripDeletion();
    },
    [firebaseUser, setUserTrips, addToast],
  );

  if (userTrips.length === 0) {
    return (
      <>
        <div>
          <p className="text-gray-500 dark:text-gray-300 mt-4">
            {NO_TRIPS_TEXT}
          </p>
        </div>
      </>
    );
  }

  return (
    <ul className="list">
      {userTrips.map((trip) => (
        <li
          key={trip.id}
          className="list-row cursor-pointer px-0"
          onClick={() => {
            void navigate(`/trips/${trip.id.toString()}`);
          }}
        >
          <div className="list-col-grow">
            <div className="">{trip.name}</div>
            <div className="text-xs font-semibold light:opacity-60 dark:text-gray-200">
              {trip.destination}
            </div>
          </div>
          <button
            type="button"
            aria-label={DELETE_TRIP_BUTTON_LABEL}
            aria-haspopup="dialog"
            className="cursor-pointer text-error can-hover:text-error/40 hover:text-error z-10"
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteTrip(trip.id);
            }}
          >
            <Trash2 />
          </button>
        </li>
      ))}
    </ul>
  );
}
