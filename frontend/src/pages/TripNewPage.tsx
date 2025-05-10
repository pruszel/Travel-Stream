// frontend/src/pages/TripNewPage.tsx

import * as React from "react";
import { useCallback, useContext } from "react";
import { useNavigate } from "react-router";

import { BaseTrip, createTrip } from "@/utils/tripService";
import { ToastContext } from "@/contexts/toastContext";
import { convertFormDataToStringSafely } from "@/utils/utils";
import { AuthContext } from "@/contexts/authContext";
import { trackEvent } from "@/lib/firebase";

export const TRIP_NEW_PAGE_HEADER = "New Trip";
export const TRIP_NEW_PAGE_FORM_NAME = "new-trip-form";
export const TRIP_NEW_PAGE_FORM_ACCESSIBLE_NAME = "New Trip Form";
export const CANCEL_BUTTON_TEXT = "Cancel";
export const TRIP_ADD_SUCCESS_MESSAGE = "Trip added successfully.";
const ERROR_MESSAGE_NO_USER =
  "Error while rendering TripNewPage: No Firebase user found.";

export function TripNewPage() {
  const { firebaseUser } = useContext(AuthContext);

  if (!firebaseUser) {
    console.error(ERROR_MESSAGE_NO_USER);
    return null;
  }

  return (
    <>
      <section>
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">{TRIP_NEW_PAGE_HEADER}</h2>
          <AddTripForm />
        </div>
      </section>
    </>
  );
}

function AddTripForm() {
  const { firebaseUser } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleAddTripFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!firebaseUser) {
        return;
      }

      const formData = new FormData(event.currentTarget);
      const newTrip = formatAddTripFormData(formData);

      const handleTripCreation = async () => {
        const token = await firebaseUser.getIdToken();
        const response = await createTrip(token, newTrip);
        if (response.data) {
          addToast("success", TRIP_ADD_SUCCESS_MESSAGE);
          void trackEvent("add_trip");
          void navigate(`/trips/${response.data.id.toString()}`);
        }
        (event.target as HTMLFormElement).reset();
      };

      void handleTripCreation();
    },
    [firebaseUser, addToast, navigate],
  );

  return (
    <>
      <form
        className="flex flex-col gap-4"
        name={TRIP_NEW_PAGE_FORM_NAME}
        aria-label={TRIP_NEW_PAGE_FORM_ACCESSIBLE_NAME}
        onSubmit={handleAddTripFormSubmit}
      >
        <div className="flex flex-col gap-2">
          <label className="label" htmlFor="trip-name">
            Trip Name
          </label>
          <input
            name="trip-name"
            id="trip-name"
            type="text"
            placeholder="Hawaii Honeymoon"
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
            placeholder="Volcano tour, beach days, surfing, and more."
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
            placeholder="Honolulu"
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
            className="input validator"
            required
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            className="btn self-start"
            onClick={() => {
              void navigate("/trips");
            }}
          >
            {CANCEL_BUTTON_TEXT}
          </button>
          <button type="submit" className="btn btn-primary self-start">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

function formatAddTripFormData(formData: FormData): BaseTrip {
  return {
    name: convertFormDataToStringSafely(formData.get("trip-name")),
    description: convertFormDataToStringSafely(
      formData.get("trip-description"),
    ),
    destination: convertFormDataToStringSafely(
      formData.get("trip-destination"),
    ),
    start_date: convertFormDataToStringSafely(formData.get("trip-start-date")),
    end_date: convertFormDataToStringSafely(formData.get("trip-end-date")),
  };
}
