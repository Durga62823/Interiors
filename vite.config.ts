import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          "vendor-react": ["react", "react-dom"],
          // Routing & data fetching
          "vendor-router": ["@tanstack/react-router", "@tanstack/react-query"],
          // Animation
          "vendor-motion": ["framer-motion"],
          // Supabase
          "vendor-supabase": ["@supabase/supabase-js"],
          // UI primitives
          "vendor-radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          // Charts & tables
          "vendor-data": ["recharts", "@tanstack/react-table"],
        },
      },
    },
  },
});

