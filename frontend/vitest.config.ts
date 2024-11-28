import react from "@vitejs/plugin-react";
import { defineConfig } from 'vitest/config'
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
      },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
})

