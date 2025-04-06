// constants.ts

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.travelstreamapp.com"
    : "http://127.0.0.1:8000";
