import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This bundle executes in Node only at build time. Keep it independent from
// adapters/plugins added to the browser or deployment configuration.
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: "src/server.tsx",
    outDir: ".prerender",
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: {
      output: {
        format: "es",
        entryFileNames: "server.js",
      },
    },
  },
});
