import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const manifestForPlugin: Partial<VitePWAOptions> = {
    registerType: "autoUpdate",
    includeAssets: ["favicon.ico", "pwa-192x192.png", "pwa-512x512.png"],
    manifest: {
        name: "Quickplot",
        short_name: "Quickplot",
        description: "Plot data",
        theme_color: "#ffffff",
        //start_url: "/",
        //background_color: "ffffff",
        //display: "standalone",
        //orientation: "portrait",
        icons: [
            {
                src: "pwa-512x512.png",
                type: "image/png",
                sizes: "512x512",
            },
            {
                src: "pwa-192x192.png",
                type: "image/png",
                sizes: "192x192",
            },
            {
                src: "pwa-512x512.png",
                type: "image/png",
                sizes: "512x512",
                purpose: "maskable",
            },
        ],
    },
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA(manifestForPlugin), nodePolyfills()],
    base: "/quickplot/",
});
