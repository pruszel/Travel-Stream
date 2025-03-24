import App from "./App";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

describe("App", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the text 'Hello, World!'", () => {
    render(<App />);
    expect(screen.getByText("Hello, World!")).toBeDefined();
  });

  it("button text changes on click", async () => {
    render(<App />);
    const button = screen.getByText("Click me");
    expect(button).toBeDefined();
    button.click();
    const updatedButton = await screen.findByText("Thanks!");
    expect(updatedButton).toBeDefined();
  });
});
