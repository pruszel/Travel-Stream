// frontend/src/components/Toast.test.tsx

import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Toast } from "./Toast";
import { ToastContext, Toast as ToastType } from "@/contexts/toastContext";

// Helper function to create a wrapper with mocked context
const renderWithToastContext = (toasts: ToastType[]) => {
  return render(
    <ToastContext.Provider
      value={{
        toasts,
        addToast: () => vi.fn(),
        removeToast: () => vi.fn(),
      }}
    >
      <Toast />
    </ToastContext.Provider>,
  );
};

/**
 * Toast tests
 */
describe("Toast", () => {
  beforeEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render nothing when there are no toasts", () => {
    const { container } = renderWithToastContext([]);
    expect(container.innerHTML).toBe("");
  });

  it("should render a success toast with the correct class name", () => {
    renderWithToastContext([
      { id: 1, type: "success", message: "Success message" },
    ]);

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toHaveClass("alert");
    expect(alertElement).toHaveClass("alert-success");
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  it("should render an error toast with the correct class name", () => {
    renderWithToastContext([
      { id: 2, type: "error", message: "Error message" },
    ]);

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toHaveClass("alert");
    expect(alertElement).toHaveClass("alert-error");
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("should render a warning toast with the correct class name", () => {
    renderWithToastContext([
      { id: 3, type: "warning", message: "Warning message" },
    ]);

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toHaveClass("alert");
    expect(alertElement).toHaveClass("alert-warning");
    expect(screen.getByText("Warning message")).toBeInTheDocument();
  });

  it("should render an info toast with the correct class name", () => {
    renderWithToastContext([{ id: 4, type: "info", message: "Info message" }]);

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toHaveClass("alert");
    expect(alertElement).toHaveClass("alert-info");
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  it("should render multiple toasts when provided", () => {
    const { container } = renderWithToastContext([
      { id: 5, type: "success", message: "First toast" },
      { id: 6, type: "error", message: "Second toast" },
      { id: 7, type: "warning", message: "Third toast" },
    ]);

    const alertElements = container.querySelectorAll('[role="alert"]');
    expect(alertElements).toHaveLength(3);

    expect(alertElements[0]).toHaveClass("alert-success");
    expect(alertElements[1]).toHaveClass("alert-error");
    expect(alertElements[2]).toHaveClass("alert-warning");

    expect(screen.getByText("First toast")).toBeInTheDocument();
    expect(screen.getByText("Second toast")).toBeInTheDocument();
    expect(screen.getByText("Third toast")).toBeInTheDocument();
  });

  it("should render each toast with the toast class", () => {
    renderWithToastContext([
      { id: 8, type: "success", message: "Toast message" },
    ]);

    const toastElement = screen.getByText("Toast message").closest(".toast");
    expect(toastElement).toHaveClass("toast");
  });
});
