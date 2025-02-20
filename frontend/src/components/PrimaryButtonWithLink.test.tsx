import { describe, test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { PrimaryButtonWithLink } from "./PrimaryButtonWithLink";

describe("PrimaryButtonWithLink", () => {
  afterEach(async () => {
    cleanup();
  });

  test("renders children correctly", () => {
    render(
      <MemoryRouter>
        <PrimaryButtonWithLink to="/test">Click me</PrimaryButtonWithLink>
      </MemoryRouter>,
    );

    expect(screen.getByText("Click me")).toBeDefined();
  });

  test("applies the default styling using className", () => {
    render(
      <MemoryRouter>
        <PrimaryButtonWithLink to="/test">Click me</PrimaryButtonWithLink>
      </MemoryRouter>,
    );

    expect(screen.getByText("Click me").className).toBe(
      "inline-block rounded-md bg-blue-500 px-5 py-2 text-gray-800 text-white hover:bg-blue-400",
    );
  });

  test("passes additional props to Link component", () => {
    render(
      <MemoryRouter>
        <PrimaryButtonWithLink
          to="/test"
          id="test-button"
          data-testid="test-link"
        >
          Click me
        </PrimaryButtonWithLink>
      </MemoryRouter>,
    );

    const link = screen.getByTestId("test-link");
    expect(link).toBeDefined();
    expect(link.tagName.toLowerCase()).toBe("a");
    expect(link.attributes.getNamedItem("id")?.value).toBe("test-button");
    expect(link.attributes.getNamedItem("href")?.value).toBe("/test");
  });

  test("type check: className prop should not be allowed", () => {
    render(
      <MemoryRouter>
        {/*@ts-expect-error - className prop should not be accepted*/}
        <PrimaryButtonWithLink to="/test" className="custom">
          Click me
        </PrimaryButtonWithLink>
        ,
      </MemoryRouter>,
    );
  });
});
