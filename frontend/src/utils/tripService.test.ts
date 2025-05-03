// frontend/src/utils/tripService.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  API_BASE_URL,
  FRIENDLY_ERROR_MESSAGES,
  type Trip,
  type BaseTrip,
} from "./tripService";

beforeEach(() => {
  // Stub the global fetch function
  vi.stubGlobal("fetch", vi.fn());
  // Reset mocks before each test
  vi.resetAllMocks();
});

afterEach(() => {
  // Restore fetch
  vi.unstubAllGlobals();
  // Clear all mocks
  vi.clearAllMocks();
  // Restore any spied methods
  vi.restoreAllMocks();
});

const mockFirebaseToken = "test-token";

const mockTrip: Trip = {
  id: 1,
  name: "Test Trip",
  description: "A trip for testing",
  destination: "Test Destination",
  start_date: "2024-01-01",
  end_date: "2024-01-10",
};

const mockBaseTrip: BaseTrip = {
  name: "New Test Trip",
  description: "Another trip for testing",
  destination: "New Destination",
  start_date: "2024-02-01",
  end_date: "2024-02-10",
};

function mockFetchResponse(body: unknown, status: number, ok: boolean): void {
  vi.mocked(fetch).mockResolvedValue({
    ok,
    status,
    json: () => body,
  } as Response);
}

function mockFetchError(error: Error): void {
  vi.mocked(fetch).mockRejectedValue(error);
}

describe("createTrip", () => {
  it("should send a POST request and return the created trip on success", async () => {
    mockFetchResponse(mockTrip, 201, true);

    const result = await createTrip(mockFirebaseToken, mockBaseTrip);

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/trips/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mockFirebaseToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mockBaseTrip),
    });
    expect(result).toEqual({ data: mockTrip });
  });

  it("should return an unauthorized error for 401 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Unauthorized" }, 401, false);

    const result = await createTrip(mockFirebaseToken, mockBaseTrip);

    expect(result).toEqual({
      error: {
        type: "unauthorized",
        message: FRIENDLY_ERROR_MESSAGES.unauthorized,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a server error for 500 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Server Error" }, 500, false);

    const result = await createTrip(mockFirebaseToken, mockBaseTrip);

    expect(result).toEqual({
      error: { type: "server", message: FRIENDLY_ERROR_MESSAGES.server },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a general error for other non-ok statuses", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Bad Request" }, 400, false);

    const result = await createTrip(mockFirebaseToken, mockBaseTrip);

    expect(result).toEqual({
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a general error and log on fetch network error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    const networkError = new Error("Network failed");
    mockFetchError(networkError);

    const result = await createTrip(mockFirebaseToken, mockBaseTrip);

    expect(result).toEqual({
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Trips API request error: ",
      networkError,
    );
  });
});

describe("getTrips", () => {
  it("should send a GET request and return a list of trips on success", async () => {
    const mockTrips = [mockTrip];
    mockFetchResponse(mockTrips, 200, true);

    const result = await getTrips(mockFirebaseToken);

    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/trips/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${mockFirebaseToken}`,
      },
    });
    expect(result).toEqual({ data: mockTrips });
  });

  it("should return an unauthorized error for 401 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Unauthorized" }, 401, false);

    const result = await getTrips(mockFirebaseToken);

    expect(result).toEqual({
      error: {
        type: "unauthorized",
        message: FRIENDLY_ERROR_MESSAGES.unauthorized,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a server error for 500 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Server Error" }, 500, false);

    const result = await getTrips(mockFirebaseToken);

    expect(result).toEqual({
      error: { type: "server", message: FRIENDLY_ERROR_MESSAGES.server },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a general error and log on fetch network error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    const networkError = new Error("Network failed");
    mockFetchError(networkError);

    const result = await getTrips(mockFirebaseToken);

    expect(result).toEqual({
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Trips API request error: ",
      networkError,
    );
  });
});

describe("getTrip", () => {
  const tripId = 1;

  it("should send a GET request for a specific trip and return it on success", async () => {
    mockFetchResponse(mockTrip, 200, true);

    const result = await getTrip(mockFirebaseToken, tripId);

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/trips/${tripId.toString()}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${mockFirebaseToken}`,
        },
      },
    );
    expect(result).toEqual({ data: mockTrip });
  });

  it("should return an unauthorized error for 401 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Unauthorized" }, 401, false);

    const result = await getTrip(mockFirebaseToken, tripId);

    expect(result).toEqual({
      error: {
        type: "unauthorized",
        message: FRIENDLY_ERROR_MESSAGES.unauthorized,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a server error for 500 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Server Error" }, 500, false);

    const result = await getTrip(mockFirebaseToken, tripId);

    expect(result).toEqual({
      error: { type: "server", message: FRIENDLY_ERROR_MESSAGES.server },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a general error for 404 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Not Found" }, 404, false);

    const result = await getTrip(mockFirebaseToken, tripId);

    expect(result).toEqual({
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a general error and log on fetch network error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    const networkError = new Error("Network failed");
    mockFetchError(networkError);

    const result = await getTrip(mockFirebaseToken, tripId);

    expect(result).toEqual({
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Trips API request error: ",
      networkError,
    );
  });
});

describe("updateTrip", () => {
  const tripId = 1;
  const updatedTripData = { ...mockTrip, name: "Updated Test Trip" };

  it("should send a PATCH request and return the updated trip on success", async () => {
    mockFetchResponse(updatedTripData, 200, true);

    const result = await updateTrip(mockFirebaseToken, tripId, updatedTripData);

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/trips/${tripId.toString()}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${mockFirebaseToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTripData),
      },
    );
    expect(result).toEqual({ data: updatedTripData });
  });

  it("should return an unauthorized error for 401 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Unauthorized" }, 401, false);

    const result = await updateTrip(mockFirebaseToken, tripId, updatedTripData);

    expect(result).toEqual({
      error: {
        type: "unauthorized",
        message: FRIENDLY_ERROR_MESSAGES.unauthorized,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a server error for 500 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Server Error" }, 500, false);

    const result = await updateTrip(mockFirebaseToken, tripId, updatedTripData);

    expect(result).toEqual({
      error: { type: "server", message: FRIENDLY_ERROR_MESSAGES.server },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a general error for other non-ok statuses", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Bad Request" }, 400, false);

    const result = await updateTrip(mockFirebaseToken, tripId, updatedTripData);

    expect(result).toEqual({
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a general error and log on fetch network error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    const networkError = new Error("Network failed");
    mockFetchError(networkError);

    const result = await updateTrip(mockFirebaseToken, tripId, updatedTripData);

    expect(result).toEqual({
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Trips API request error: ",
      networkError,
    );
  });
});

describe("deleteTrip", () => {
  const tripId = 1;

  it("should send a DELETE request and return null data on success", async () => {
    mockFetchResponse(null, 204, true);

    const result = await deleteTrip(mockFirebaseToken, tripId);

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/trips/${tripId.toString()}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${mockFirebaseToken}`,
        },
      },
    );
    expect(result).toEqual({ data: null });
  });

  it("should return an unauthorized error for 401 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Unauthorized" }, 401, false);

    const result = await deleteTrip(mockFirebaseToken, tripId);

    expect(result).toEqual({
      error: {
        type: "unauthorized",
        message: FRIENDLY_ERROR_MESSAGES.unauthorized,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a server error for 500 status", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Server Error" }, 500, false);

    const result = await deleteTrip(mockFirebaseToken, tripId);

    expect(result).toEqual({
      error: { type: "server", message: FRIENDLY_ERROR_MESSAGES.server },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a general error for other non-ok statuses", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    mockFetchResponse({ detail: "Not Found" }, 404, false);

    const result = await deleteTrip(mockFirebaseToken, tripId);

    expect(result).toEqual({
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
  });

  it("should return a general error and log on fetch network error", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {
        return;
      });
    const networkError = new Error("Network failed");
    mockFetchError(networkError);

    const result = await deleteTrip(mockFirebaseToken, tripId);

    expect(result).toEqual({
      error: { type: "general", message: FRIENDLY_ERROR_MESSAGES.general },
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Trips API request error: ",
      networkError,
    );
  });
});
