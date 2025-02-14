import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    // Make it directly from src "@" -> starts from src
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
   build: {
    outDir: 'dist', // Specify the output directory for built assets
  },
});
