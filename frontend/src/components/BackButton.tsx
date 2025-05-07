// frontend/src/components/BackButton.tsx

import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export const DEFAULT_BACK_BUTTON_TEXT = "back";

/**
 * @param path - The path to navigate to when the back button is clicked.
 *               If not provided, it will navigate to the previous page.
 * @param text - The text to display on the back button. Defaults to "back".
 */
export function BackButton({
  path,
  text = DEFAULT_BACK_BUTTON_TEXT,
}: {
  path?: string;
  text?: string;
}) {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    async function navigateToPreviousPage() {
      if (path) {
        await navigate(path);
      } else {
        await navigate(-1);
      }
    }

    void navigateToPreviousPage();
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-link -m-4 text-gray-700 hover:underline dark:text-gray-200"
        onClick={handleBackButtonClick}
      >
        <ArrowLeft className="w-4 h-auto" /> {text}
      </button>
    </>
  );
}
