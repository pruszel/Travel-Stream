import { describe, test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { BaseLinkButton } from "./BaseLinkButton";

describe("BaseLinkButton", () => {
  afterEach(async () => {
    cleanup();
  });

  test("renders children correctly", () => {
    render(
      <MemoryRouter>
        <BaseLinkButton to="/test">Click me</BaseLinkButton>
      </MemoryRouter>,
    );

    expect(screen.getByText("Click me")).toBeDefined();
  });

  test("passes className prop correctly", () => {
    render(
      <MemoryRouter>
        <BaseLinkButton to="/test" className="custom-class">
          Click me
        </BaseLinkButton>
      </MemoryRouter>,
    );

    expect(screen.getByText("Click me").className).toBe("custom-class");
  });

  test("passes additional props to Link component", () => {
    render(
      <MemoryRouter>
        <BaseLinkButton to="/test" id="test-button" data-testid="test-link">
          Click me
        </BaseLinkButton>
      </MemoryRouter>,
    );

    const link = screen.getByTestId("test-link");
    expect(link).toBeDefined();
    expect(link.attributes.getNamedItem("id")?.value).toBe("test-button");
    expect(link.attributes.getNamedItem("href")?.value).toBe("/test");
  });
});
