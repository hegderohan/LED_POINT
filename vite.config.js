import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static SPA. Netlify serves at the domain root, so base "/" is correct
// and public assets (e.g. /products/foo.jpg) resolve cleanly.
export default defineConfig({
  plugins: [react()],
});
