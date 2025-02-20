import { describe, test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { TextButtonWithLink } from "./TextButtonWithLink";

describe("TextButtonWithLink", () => {
  afterEach(async () => {
    cleanup();
  });

  test("renders children correctly", () => {
    render(
      <MemoryRouter>
        <TextButtonWithLink to="/test">Click me</TextButtonWithLink>
      </MemoryRouter>,
    );

    expect(screen.getByText("Click me")).toBeDefined();
  });

  test("applies the default styling using className", () => {
    render(
      <MemoryRouter>
        <TextButtonWithLink to="/test">Click me</TextButtonWithLink>
      </MemoryRouter>,
    );

    expect(screen.getByText("Click me").className).toBe(
      "px-2 py-2 hover:underline",
    );
  });

  test("passes additional props to Link component", () => {
    render(
      <MemoryRouter>
        <TextButtonWithLink to="/test" id="test-button" data-testid="test-link">
          Click me
        </TextButtonWithLink>
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
        <TextButtonWithLink to="/test" className="custom">
          Click me
        </TextButtonWithLink>
        ,
      </MemoryRouter>,
    );
  });
});
