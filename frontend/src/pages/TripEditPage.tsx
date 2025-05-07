// frontend/src/pages/TripEditPage.tsx

import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import { getTrip, Trip, updateTrip } from "@/utils/tripService";
import { ToastContext } from "@/contexts/toastContext";
import { AuthContext } from "@/contexts/authContext";
import { convertFormDataToStringSafely } from "@/utils/utils";
import { trackEvent } from "@/lib/firebase";
import { FRIENDLY_ERROR_MESSAGES } from "@/constants.ts";

export const TRIP_EDIT_PAGE_FORM_NAME = "edit-trip-form";
export const TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME = "Edit Trip Form";
export const TRIP_EDIT_PAGE_CANCEL_BUTTON_TEXT = "Cancel";
export const TRIP_EDIT_PAGE_SUBMIT_BUTTON_TEXT = "Save";
export const TRIP_UPDATE_SUCCESS_MESSAGE = "Trip updated successfully.";

export function TripEditPage() {
  const { id: idParam } = useParams();
  if (!idParam) {
    throw new Error("Trip ID is required");
  }
  const tripId = parseInt(idParam);

  return (
    <>
      <EditTripForm tripId={tripId} />
    </>
  );
}

interface EditTripFormProps {
  tripId: number;
}

export function EditTripForm({ tripId }: EditTripFormProps) {
  const { firebaseUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);

  const [trip, setTrip] = useState<Trip | null>(null);

  // Load the trip details
  useEffect(() => {
    const handleLoadingTripDetails = async () => {
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      const response = await getTrip(token, tripId);

      if (response.data) {
        setTrip(response.data);
      } else if (response.error) {
        console.error(`Error loading trip details: ${response.error.message}`);
        addToast("error", response.error.message);
      }
    };

    void handleLoadingTripDetails();
  }, [firebaseUser, tripId, addToast]);

  const handleEditTripFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!firebaseUser) return;

      const handleTripUpdate = async (formData: FormData) => {
        const token = await firebaseUser.getIdToken();
        const updatedTrip = {
          id: tripId,
          name: convertFormDataToStringSafely(formData.get("trip-name")),
          description: convertFormDataToStringSafely(
            formData.get("trip-description"),
          ),
          destination: convertFormDataToStringSafely(
            formData.get("trip-destination"),
          ),
          start_date: convertFormDataToStringSafely(
            formData.get("trip-start-date"),
          ),
          end_date: convertFormDataToStringSafely(
            formData.get("trip-end-date"),
          ),
        };

        const response = await updateTrip(token, tripId, updatedTrip);
        if (response.data) {
          addToast("success", TRIP_UPDATE_SUCCESS_MESSAGE);
          void trackEvent("update_trip");
          void navigate(`/trips/${tripId.toString()}`);
        } else if (response.error) {
          console.error("Error updating trip: ", response.error.message);
          addToast("error", FRIENDLY_ERROR_MESSAGES.general);
        }
      };

      const formData = new FormData(event.currentTarget);
      void handleTripUpdate(formData);
    },
    [firebaseUser, tripId, addToast, navigate],
  );

  if (!firebaseUser) {
    return null;
  }

  if (!trip) {
    return <p>Loading trip details...</p>;
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Edit Trip</h2>
      <form
        className="flex flex-col gap-4"
        name={TRIP_EDIT_PAGE_FORM_NAME}
        aria-label={TRIP_EDIT_PAGE_FORM_ACCESSIBLE_NAME}
        onSubmit={handleEditTripFormSubmit}
      >
        <div className="flex flex-col gap-2">
          <label className="label" htmlFor="trip-name">
            Trip Name
          </label>
          <input
            name="trip-name"
            id="trip-name"
            type="text"
            placeholder={trip.name}
            defaultValue={trip.name}
            className="input validator"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="label" htmlFor="trip-description">
            Description
          </label>
          <textarea
            name="trip-description"
            id="trip-description"
            placeholder={trip.description}
            defaultValue={trip.description}
            className="textarea"
          ></textarea>
        </div>
        <div className="flex flex-col gap-2">
          <label className="label" htmlFor="trip-destination">
            Destination
          </label>
          <input
            name="trip-destination"
            id="trip-destination"
            type="text"
            placeholder={trip.destination}
            defaultValue={trip.destination}
            className="input validator"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="label" htmlFor="trip-start-date">
            Start Date
          </label>
          <input
            name="trip-start-date"
            id="trip-start-date"
            type="date"
            defaultValue={trip.start_date}
            className="input validator"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="label" htmlFor="trip-end-date">
            End Date
          </label>
          <input
            name="trip-end-date"
            id="trip-end-date"
            type="date"
            defaultValue={trip.end_date}
            className="input validator"
            required
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            className="btn"
            onClick={() => {
              async function navigateToTripShowPage() {
                await navigate(`/trips/${tripId.toString()}`);
              }

              void navigateToTripShowPage();
            }}
          >
            {TRIP_EDIT_PAGE_CANCEL_BUTTON_TEXT}
          </button>
          <button type="submit" className="btn btn-primary self-start">
            {TRIP_EDIT_PAGE_SUBMIT_BUTTON_TEXT}
          </button>
        </div>
      </form>
    </section>
  );
}
