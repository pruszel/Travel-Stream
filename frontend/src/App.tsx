import * as React from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

interface Trip {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
}

function App() {
  const [trips, setTrips] = React.useState<Trip[]>([]);

  React.useEffect(() => {
    const savedTrips = localStorage.getItem("trips") || "[]";
    setTrips(JSON.parse(savedTrips));
  }, []);

  return (
    <>
      <div className="h-full bg-emerald-50">
        {trips.length ? (
          <TripList trips={trips} />
        ) : (
          <AddTrip setTrips={setTrips} />
        )}
      </div>
    </>
  );
}

interface PrimaryButtonProps {
  text: string;
  type: "submit" | "button" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function PrimaryButton({ text, type, onClick }: PrimaryButtonProps) {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className="bg-slate-400 hover:bg-slate-300 cursor-pointer rounded-lg mt-6 py-2 px-6"
      >
        {text}
      </button>
    </>
  );
}

function TripList({ trips }: { trips: Trip[] }) {
  return (
    <>
      <div className="p-8 flex justify-center">
        <div className="py-8 px-12 border-2 shadow border-slate-200 bg-white rounded-md">
          <h1 className="text-2xl">Your trips</h1>
          <ul className="mt-6 list-disc pl-4">
            {trips.map((trip) => {
              return (
                <li
                  key={trip.destination}
                  className="text-blue-500 underline cursor-pointer"
                >
                  {trip.destination}
                </li>
              );
            })}
          </ul>
          <PrimaryButton type="button" text="Add trip" />
        </div>
      </div>
    </>
  );
}

function AddTrip({
  setTrips,
}: {
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
}) {
  const [formData, setFormData] = React.useState<Trip>({
    id: uuidv4(),
    destination: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrips((trips) => [...trips, formData]);
    localStorage.setItem("trips", JSON.stringify([formData]));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-8 flex justify-center">
        <div className="py-8 px-12 border-2 shadow border-slate-200 bg-white rounded-md">
          <h1 className="text-2xl">Plan a trip</h1>
          <div className="flex flex-col items-start mt-4">
            <label htmlFor="destination" className="pb-1">
              Where are you going?
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="bg-slate-200 py-1 px-2 border-2 border-slate-300 rounded-md"
            ></input>

            <label htmlFor="departureDate" className="mt-4 pb-1">
              When are you leaving?
            </label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={formData.startDate.toISOString().split("T")[0]}
              onChange={handleChange}
              className=""
            ></input>

            <label htmlFor="departureDate" className="mt-4 pb-1">
              When are you coming back?
            </label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={formData.endDate.toISOString().split("T")[0]}
              onChange={handleChange}
            ></input>

            <PrimaryButton type="submit" text="Submit" />
          </div>
        </div>
      </form>
    </>
  );
}

export default App;
