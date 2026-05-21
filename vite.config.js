import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";



export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 8070,

    proxy: {
      "/geoserver": {
        target: "https://27.100.38.133",
        changeOrigin: true,
        secure: false,

        // Do NOT let browser follow public-IP redirects
        followRedirects: false,

        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            // Remove redirect header so browser stays on localhost
            delete proxyRes.headers.location;

            // Helpful for local dev
            proxyRes.headers["access-control-allow-origin"] = "*";
            proxyRes.headers["access-control-allow-methods"] =
              "GET, POST, OPTIONS";
            proxyRes.headers["access-control-allow-headers"] =
              "Origin, X-Requested-With, Content-Type, Accept, Authorization";
          });

          proxy.on("error", (err, req) => {
            console.error("[GeoServer proxy error]", err.message, req.url);
          });
        },
      },
    },
  },
});