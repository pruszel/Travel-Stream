// frontend/src/constants.ts

export const DEFAULT_TOAST_DURATION = 5;

export const AUTH_ERROR_MESSAGE = `Something went wrong. Try signing in with Google again. If the problem persists, contact support at <a href="mailto:support@travelstreamapp.com">support@travelstreamapp.com</a>.`;

export const LD_CLIENT_ID = import.meta.env.PROD
  ? `67f0bff500b7a80955249fc7`
  : `67f0bff500b7a80955249fc6`;
