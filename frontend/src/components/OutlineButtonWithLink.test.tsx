import { describe, test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { OutlineButtonWithLink } from "./OutlineButtonWithLink";

describe("OutlineButtonWithLink", () => {
  afterEach(async () => {
    cleanup();
  });

  test("renders children correctly", () => {
    render(
      <MemoryRouter>
        <OutlineButtonWithLink to="/test">Click me</OutlineButtonWithLink>
      </MemoryRouter>,
    );

    expect(screen.getByText("Click me")).toBeDefined();
  });

  test("applies the default styling using className", () => {
    render(
      <MemoryRouter>
        <OutlineButtonWithLink to="/test">Click me</OutlineButtonWithLink>
      </MemoryRouter>,
    );

    expect(screen.getByText("Click me").className).toBe(
      "rounded-md px-4 py-2 text-gray-800 ring-1 ring-blue-700 hover:bg-blue-100 hover:ring-2",
    );
  });

  test("passes additional props to Link component", () => {
    render(
      <MemoryRouter>
        <OutlineButtonWithLink
          to="/test"
          id="test-button"
          data-testid="test-link"
        >
          Click me
        </OutlineButtonWithLink>
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
        <OutlineButtonWithLink to="/test" className="custom">
          Click me
        </OutlineButtonWithLink>
        ,
      </MemoryRouter>,
    );
  });
});
