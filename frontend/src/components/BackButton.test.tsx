// frontend/src/components/BackButton.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { BackButton, DEFAULT_BACK_BUTTON_TEXT } from "./BackButton";

// Mock react-router's useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

/**
 * BackButton tests
 */
describe("<BackButton />", () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render the back button with default text and icon", () => {
    render(<BackButton />);

    expect(screen.getByText(DEFAULT_BACK_BUTTON_TEXT)).toBeInTheDocument();

    // Verify button role
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Verify SVG icon
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("should render the back button with custom text when text prop is set", () => {
    render(<BackButton text="Go Back" />);

    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("should call navigate with -1 when no path prop is provided", () => {
    render(<BackButton />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should call navigate with the provided path when path prop is set", () => {
    const testPath = "/previous-page";
    render(<BackButton path={testPath} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(testPath);
  });
});
