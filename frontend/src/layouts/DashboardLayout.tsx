import { Outlet } from "react-router";
import Header from "./Header";

export default function DashboardLayout() {
  return (
    <>
      <div className="flex h-full flex-col">
        <Header />
        <main className="h-full bg-blue-50 p-8">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
