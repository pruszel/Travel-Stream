// frontend/src/components/LoadingScreen.tsx

export function LoadingScreen() {
  return (
    <>
      <div
        className="h-screen w-screen flex items-center justify-center"
        role="progressbar"
        aria-valuetext="Loading…"
        aria-live="assertive"
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="loading loading-spinner loading-xl"></div>
      </div>
    </>
  );
}
