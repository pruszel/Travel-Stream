// frontend/src/contexts/toastProvider.test.tsx

import { describe, expect, it, vi, beforeEach } from "vitest";
import { useContext } from "react";
import {
  cleanup,
  render,
  screen,
  act,
  fireEvent,
} from "@testing-library/react";

import { ToastProvider } from "./toastProvider";
import { ToastContext } from "./toastContext";
import { DEFAULT_TOAST_EXPIRATION_IN_SECONDS } from "@/constants";

// Mock setTimeout and clearTimeout
vi.useFakeTimers();

// Test component to consume the context
const TestComponent = () => {
  const { toasts, addToast, removeToast } = useContext(ToastContext);

  return (
    <div>
      <div data-testid="toasts-count">{toasts.length}</div>

      <div data-testid="toasts-list">
        {toasts.map((toast) => (
          <div key={toast.id} data-testid={`toast-${toast.id.toString()}`}>
            {toast.type}: {toast.message}
          </div>
        ))}
      </div>

      <button
        type="button"
        data-testid="add-success-toast"
        onClick={() => {
          addToast("success", "Success message");
        }}
      >
        Add Success Toast
      </button>

      <button
        type="button"
        data-testid="add-error-toast"
        onClick={() => {
          addToast("error", "Error message");
        }}
      >
        Add Error Toast
      </button>

      <button
        type="button"
        data-testid="add-persistent-toast"
        onClick={() => {
          addToast("info", "Persistent message", -1);
        }}
      >
        Add Persistent Toast
      </button>

      <button
        type="button"
        data-testid="remove-toast"
        onClick={() => {
          if (toasts.length > 0) {
            removeToast(toasts[0].id);
          }
        }}
      >
        Remove First Toast
      </button>
    </div>
  );
};

/**
 * ToastProvider tests
 */
describe("ToastProvider", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it("should provide toast context with initial empty toasts array", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    expect(screen.getByTestId("toasts-count").textContent).toBe("0");
  });

  it("should add a toast when addToast is called", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success-toast"));

    expect(screen.getByTestId("toasts-count").textContent).toBe("1");
    expect(screen.getByTestId("toasts-list").textContent).toContain(
      "success: Success message",
    );
  });

  it("should add multiple toasts when addToast is called multiple times", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success-toast"));
    fireEvent.click(screen.getByTestId("add-error-toast"));

    expect(screen.getByTestId("toasts-count").textContent).toBe("2");
    expect(screen.getByTestId("toasts-list").textContent).toContain(
      "success: Success message",
    );
    expect(screen.getByTestId("toasts-list").textContent).toContain(
      "error: Error message",
    );
  });

  it("should remove a toast when removeToast is called", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success-toast"));
    expect(screen.getByTestId("toasts-count").textContent).toBe("1");

    fireEvent.click(screen.getByTestId("remove-toast"));
    expect(screen.getByTestId("toasts-count").textContent).toBe("0");
  });

  it("should automatically remove a toast after the default expiration time", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-success-toast"));
    expect(screen.getByTestId("toasts-count").textContent).toBe("1");

    // Fast-forward time by the default expiration time
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TOAST_EXPIRATION_IN_SECONDS * 1000);
    });

    expect(screen.getByTestId("toasts-count").textContent).toBe("0");
  });

  it("should not automatically remove a persistent toast", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId("add-persistent-toast"));
    expect(screen.getByTestId("toasts-count").textContent).toBe("1");

    // Fast-forward time by more than the default expiration time
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TOAST_EXPIRATION_IN_SECONDS * 2000);
    });

    // The toast should still be there
    expect(screen.getByTestId("toasts-count").textContent).toBe("1");
  });
});
