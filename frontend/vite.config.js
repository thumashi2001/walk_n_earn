import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Read PORT from Backend/.env so the dev proxy matches where `npm run dev` runs the API.
 */
function readBackendPort() {
  const envPath = path.resolve(__dirname, "../Backend/.env");
  try {
    const raw = fs.readFileSync(envPath, "utf8");
    const m = raw.match(/^PORT\s*=\s*(\d+)\s*$/m);
    return m ? m[1] : "5000";
  } catch {
    return "5000";
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget =
    env.VITE_PROXY_TARGET || `http://127.0.0.1:${readBackendPort()}`;

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
