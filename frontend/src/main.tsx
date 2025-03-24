import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

export function getRootElById(
  document: Document,
  id: string,
): HTMLElement | null {
  return document.getElementById(id);
}

function initializeReact(rootEl: HTMLElement) {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export function main(document: Document | undefined) {
  if (!document) {
    throw new Error("Document is undefined");
  }

  const rootEl = getRootElById(document, "root");
  if (!rootEl) {
    throw new Error("Root element not found");
  }

  initializeReact(rootEl);
}

// Only run in browser environment, not during testing
if (typeof window !== "undefined" && !import.meta.env.TEST) {
  try {
    main(document);
  } catch (error) {
    console.error(error);
  }
}
