import * as React from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@uidotdev/usehooks";

const LOCAL_STORAGE_KEY = "TravelStream";

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Preferences {
  theme: "default";
}

interface LocalStorageSchema {
  userId: string;
  trips: Trip[];
  preferences: Preferences;
}

function App() {
  const [isAddingTrip, setIsAddingTrip] = React.useState<boolean>(false);
  const [appData, saveAppData] = useLocalStorage(LOCAL_STORAGE_KEY, {
    userId: "",
    trips: [] as Trip[],
    preferences: { theme: "default" as const },
  });

  const handleAddTrip = () => {
    setIsAddingTrip(true);
  };

  return (
    <>
      <div className="h-full bg-blue-50">
        <div className="flex flex-wrap gap-8 max-w-[1200px] w-[90%] sm:w-[80%] mx-auto p-4 sm:p-8">
          {isAddingTrip ? (
            <BentoBox heading="Add Trip">
              <AddTrip
                appData={appData}
                saveAppData={saveAppData}
                setIsAddingTrip={setIsAddingTrip}
              />
            </BentoBox>
          ) : null}
          <BentoBox
            heading="Your trips"
            buttonText="Add Trip"
            buttonOnClick={handleAddTrip}
          >
            <TripList appData={appData} />
          </BentoBox>
        </div>
      </div>
    </>
  );
}

function BentoBox({
  width = "w-full",
  heading,
  buttonText,
  buttonOnClick,
  children,
}: {
  width?: "w-1/4" | "w-1/2" | "w-3/4" | "w-full";
  heading?: string;
  buttonText?: string;
  buttonOnClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className={`${width} p-6 rounded-lg shadow-md bg-white border-1 border-slate-100`}
      >
        <div className="flex justify-between items-end">
          <h1 className="text-2xl font-semibold">{heading}</h1>
          {buttonText && buttonOnClick ? (
            <PrimaryButton
              type="button"
              text={buttonText}
              onClick={buttonOnClick}
            />
          ) : null}
        </div>
        {children}
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
        className="shadow-md hover:shadow-lg text-white bg-blue-700 hover:bg-blue-500 cursor-pointer rounded-lg mt-6 py-2 px-6"
      >
        {text}
      </button>
    </>
  );
}

function TripList({ appData }: { appData: LocalStorageSchema }) {
  return (
    <>
      <ul className="mt-6 list-disc pl-4">
        {appData.trips.map((trip) => {
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
    </>
  );
}

function AddTrip({
  appData,
  saveAppData,
  setIsAddingTrip,
}: {
  appData: LocalStorageSchema;
  saveAppData: React.Dispatch<React.SetStateAction<LocalStorageSchema>>;
  setIsAddingTrip: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [formData, setFormData] = React.useState<Trip>({
    id: uuidv4(),
    destination: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTrip = {
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedAppData: LocalStorageSchema = {
      ...appData,
      trips: [...appData.trips, newTrip],
    };
    saveAppData(updatedAppData);

    setIsAddingTrip(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
            value={formData.startDate}
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
            value={formData.endDate}
            onChange={handleChange}
          ></input>

          <PrimaryButton type="submit" text="Submit" />
        </div>
      </form>
    </>
  );
}

export default App;
