// frontend/src/components/LoadingScreen.tsx

export function LoadingScreen() {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-xl"></div>
      </div>
    </>
  );
}
