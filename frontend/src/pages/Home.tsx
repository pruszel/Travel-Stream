import { RecentTripsPanel } from "../components/RecentTripsPanel";
import { UpcomingTripPanel } from "../components/UpcomingTripPanel";

export default function Home() {
  return (
    <>
      {/* TODO: find and pass the next soonest trip into UpcomingTripPanel */}
      <UpcomingTripPanel trip={null} />
      <RecentTripsPanel />
    </>
  );
}
