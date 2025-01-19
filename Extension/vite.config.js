import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Ensure background.js is handled correctly
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        sidePanel: "index.html",
        background: "src/background.js", // Add background.js to the build input
      },
      // Ensure the background script is included in the build output
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") {
            return "background.js"; // Ensure background.js is placed in the dist folder
          }
          return "[name].js";
        },
      },
    },
  },
});
