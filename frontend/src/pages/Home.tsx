import { RecentTripsPanel } from "../components/RecentTripsPanel";
import { UpcomingTripPanel } from "../components/UpcomingTripPanel";

export default function Home() {
  return (
    <>
      <UpcomingTripPanel />
      <RecentTripsPanel />
    </>
  );
}
