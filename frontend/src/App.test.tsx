import App from "./App";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("App", () => {
  it("renders the text 'Hello, World!'", () => {
    render(<App />);
    expect(screen.getByText("Hello, World!")).toBeDefined();
  });
});
