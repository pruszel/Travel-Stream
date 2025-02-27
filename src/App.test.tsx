import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "./App.tsx";

describe("App", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the App component", () => {
    render(<App />);
    expect(screen.getByText("Hello, World!")).toBeDefined();
  });
});
