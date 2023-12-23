/* eslint-disable unicorn/prevent-abbreviations */
/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import path, { resolve } from "node:path";
import { defineConfig } from "vite";

import addHmr from "./utils/plugins/add-hmr";
import customDynamicImport from "./utils/plugins/custom-dynamic-import";
import makeManifest from "./utils/plugins/make-manifest";
import watchRebuild from "./utils/plugins/watch-rebuild";

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, "src");
const coreDir = resolve(srcDir, "core");
// const assetsDir = resolve(srcDir, "assets");
const outDir = resolve(rootDir, "dist");
const publicDir = resolve(rootDir, "public");

const isDevelopment = process.env.__DEV__ === "true";
const isProduction = !isDevelopment;

// ENABLE HMR IN BACKGROUND SCRIPT
const enableHmrInBackgroundScript = true;
const cacheInvalidationKeyReference = { current: generateKey() };

export default defineConfig({
  resolve: {
    alias: {
      "@popup": path.resolve(__dirname, "./src/core/popup"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    makeManifest({
      getCacheInvalidationKey,
    }),
    react(),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true }),
    isDevelopment && watchRebuild({ afterWriteBundle: regenerateCacheInvalidationKey }),
  ],
  publicDir,
  build: {
    outDir,
    /** Can slow down build speed. */
    // sourcemap: isDev,
    minify: isProduction,
    modulePreload: false,
    reportCompressedSize: isProduction,
    emptyOutDir: !isDevelopment,
    rollupOptions: {
      input: {
        popup: resolve(coreDir, "popup", "index.html"),
      },
      output: {
        entryFileNames: "src/core/[name]/index.js",
        chunkFileNames: !isDevelopment ? "assets/js/[name].js" : "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const { name } = path.parse(assetInfo.name);
          const assetFileName = name === "contentStyle" ? `${name}${getCacheInvalidationKey()}` : name;

          return `assets/[ext]/${assetFileName}.[hash].chunk.[ext]`;
        },
      },
    },
  },
});

function getCacheInvalidationKey() {
  return cacheInvalidationKeyReference.current;
}
function regenerateCacheInvalidationKey() {
  cacheInvalidationKeyReference.current = generateKey();

  return cacheInvalidationKeyReference;
}

function generateKey(): string {
  return `${Date.now().toFixed(0)}`;
}
