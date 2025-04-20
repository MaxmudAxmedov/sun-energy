// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"), // "@" prefiksi src papkasiga yo‘naltiriladi
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    root: ".",
    publicDir: "public",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    optimizeDeps: {
        include: ["react-calculator"],
    },
});
