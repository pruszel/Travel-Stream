// frontend/src/utils/tripService.ts

import { FRIENDLY_ERROR_MESSAGES } from "@/constants.ts";

export interface BaseTrip {
  name: string;
  description: string;
  destination: string;
  start_date: string;
  end_date: string;
}

export interface Trip extends BaseTrip {
  id: number;
}

export interface ApiResponse<T> {
  data?: T | null;
  error?: {
    type: ApiErrorType;
    message: string;
  };
}

export const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://api.travelstreamapp.com"
    : "http://localhost:8000";

export type ApiErrorType = keyof typeof FRIENDLY_ERROR_MESSAGES;

/**
 * @param status - HTTP status code
 */
function errorResponse<T>(status?: number): ApiResponse<T> {
  let errorType: ApiErrorType = "general";

  if (status === 401) {
    errorType = "unauthorized";
  }
  if (status && status >= 500 && status < 600) {
    errorType = "server";
  }

  return {
    error: {
      type: errorType,
      message: FRIENDLY_ERROR_MESSAGES[errorType],
    },
  };
}

async function makeRequest<T>(
  path: string,
  options: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    firebaseToken: string;
    body?: object;
  },
): Promise<ApiResponse<T>> {
  try {
    const { method, firebaseToken, body } = options;

    const headers: HeadersInit = {
      Authorization: `Bearer ${firebaseToken}`,
    };

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = (await response.json()) as T;

    if (response.ok && method === "DELETE") {
      return { data: null };
    }

    if (response.ok) {
      return { data };
    } else {
      console.error(`Error ${response.status.toString()}: `, data);
      return errorResponse(response.status);
    }
  } catch (error) {
    console.error("Trips API request error: ", error);
    return errorResponse();
  }
}

export async function createTrip(
  firebaseToken: string,
  trip: BaseTrip,
): Promise<ApiResponse<Trip>> {
  return makeRequest<Trip>("/trips/", {
    method: "POST",
    firebaseToken,
    body: trip,
  });
}

export async function getTrips(
  firebaseToken: string,
): Promise<ApiResponse<Trip[]>> {
  return makeRequest<Trip[]>("/trips/", {
    method: "GET",
    firebaseToken,
  });
}

export async function getTrip(
  firebaseToken: string,
  tripId: number,
): Promise<ApiResponse<Trip>> {
  return makeRequest<Trip>(`/trips/${tripId.toString()}/`, {
    method: "GET",
    firebaseToken,
  });
}

export async function updateTrip(
  firebaseToken: string,
  tripId: number,
  trip: Trip,
): Promise<ApiResponse<Trip>> {
  return makeRequest<Trip>(`/trips/${tripId.toString()}/`, {
    method: "PATCH",
    firebaseToken,
    body: trip,
  });
}

export async function deleteTrip(
  firebaseToken: string,
  tripId: number,
): Promise<ApiResponse<null>> {
  return makeRequest<null>(`/trips/${tripId.toString()}/`, {
    method: "DELETE",
    firebaseToken,
  });
}
