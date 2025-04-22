// frontend/src/pages/TripNewPage.tsx

import * as React from "react";
import { useCallback, useContext } from "react";
import { useNavigate } from "react-router";

import { BaseTrip, createTrip } from "@/utils/tripService.ts";
import { ToastContext } from "@/contexts/toastContext.ts";
import { convertFormDataToStringSafely } from "@/utils/utils.ts";
import { AuthContext } from "@/contexts/authContext.ts";

export function TripNewPage() {
  return (
    <>
      <section>
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">Add Trip</h2>
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
      const newTrip = addTripFormData(formData);

      const handleTripCreation = async () => {
        const token = await firebaseUser.getIdToken();
        const response = await createTrip(token, newTrip);
        if (response.data) {
          addToast("success", "Trip added successfully.");
          void navigate(`/trips/${response.data.id.toString()}`);
        }
        event.currentTarget.reset();
      };

      void handleTripCreation();
    },
    [firebaseUser, addToast, navigate],
  );

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleAddTripFormSubmit}>
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
              async function navigateToTripListPage() {
                await navigate("/trips");
              }

              void navigateToTripListPage();
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary self-start">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

function addTripFormData(formData: FormData): BaseTrip {
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
