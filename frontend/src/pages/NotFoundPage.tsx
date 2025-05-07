// frontend/src/pages/NotFoundPage.tsx

export const NOT_FOUND_PAGE_HEADER = "404 Not Found";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{NOT_FOUND_PAGE_HEADER}</h1>
      <p className="text-xl">The requested page does not exist.</p>
    </div>
  );
}
