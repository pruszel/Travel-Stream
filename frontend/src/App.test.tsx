import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { useFlags } from "launchdarkly-react-client-sdk";

import { App } from "@/App";
import {
  MAINTENANCE_PAGE_HEADER,
  MAINTENANCE_PAGE_TEXT,
} from "@/pages/MaintenancePage";

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn(),
  LDProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("<App />", () => {
  beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("should render the maintenance page when the maintenance mode flag is enabled", () => {
    vi.mocked(useFlags).mockReturnValue({ maintenanceModeEnabled: true });

    render(<App />);

    // Verify that the maintenance page is rendered
    expect(screen.getByText(MAINTENANCE_PAGE_HEADER)).toBeInTheDocument();
    expect(screen.getByText(MAINTENANCE_PAGE_TEXT)).toBeInTheDocument();
  });

  it("should not render the maintenance page when the maintenance mode flag is disabled", () => {
    vi.mocked(useFlags).mockReturnValue({ maintenanceModeEnabled: false });

    render(<App />);

    // Verify that the maintenance page is not rendered
    expect(screen.queryByText(MAINTENANCE_PAGE_HEADER)).not.toBeInTheDocument();
    expect(screen.queryByText(MAINTENANCE_PAGE_TEXT)).not.toBeInTheDocument();
  });
});
