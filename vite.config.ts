import { defineConfig } from "vite";
import { miaodaDevPlugin } from "miaoda-sc-plugin";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // >>> هذا هو الجزء الذي يحل المشكلة الأصلية لتشغيل السيرفر على الشبكة <<<
  server: {
    host: true, // يتيح الوصول من الشبكة المحلية (الهاتف)
    port: 5173, // تثبيت المنفذ الافتراضي
  },
  // >>> نهاية الجزء المضاف <<<

  plugins: [
    react(),
    miaodaDevPlugin(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});