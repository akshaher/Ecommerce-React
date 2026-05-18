import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    visualizer({
       filename: "dist/report.html",
      open: false,        // auto opens report in browser
      gzipSize: true,    // shows compressed size
      brotliSize: true,  // shows best compression
    })]
})
