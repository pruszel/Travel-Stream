// frontend/src/pages/MaintenancePage.tsx

export const MAINTENANCE_PAGE_HEADER = "Maintenance Mode";
export const MAINTENANCE_PAGE_TEXT =
  "The application is currently under maintenance.";

export function MaintenancePage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">{MAINTENANCE_PAGE_HEADER}</h1>
        <p className="text-xl">{MAINTENANCE_PAGE_TEXT}</p>
      </div>
    </>
  );
}
