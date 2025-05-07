/* istanbul ignore file */

// frontend/src/constants.ts

export const DEFAULT_TOAST_DURATION = 5;

export const AUTH_ERROR_MESSAGE = `Something went wrong. Try signing in with Google again. If the problem persists, contact support at <a href="mailto:support@travelstreamapp.com">support@travelstreamapp.com</a>.`;

export const LD_CLIENT_ID = import.meta.env.PROD
  ? `67f0bff500b7a80955249fc7`
  : `67f0bff500b7a80955249fc6`;

export const FRIENDLY_ERROR_MESSAGES = {
  unauthorized: AUTH_ERROR_MESSAGE,
  server: `This app is experiencing issues and is temporarily unavailable. Developers are working on it. Please try again later.`,
  general: `Something went wrong. Please try again.`,
};

export const TRIP_DELETED_SUCCESS_MESSAGE = "Trip deleted successfully.";
