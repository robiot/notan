/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable unicorn/prevent-abbreviations */
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import url from "node:url";
import type { PluginOption } from "vite";

import colorLog from "../log";
import ManifestParser from "../manifest-parser";

const { resolve } = path;

const rootDir = resolve(__dirname, "..", "..");
const distDir = resolve(rootDir, "dist");
const manifestFile = resolve(rootDir, "manifest.js");

const getManifestWithCacheBurst = (): Promise<{ default: chrome.runtime.ManifestV3 }> => {
  const withCacheBurst = (path: string) => `${path}?${Date.now().toString()}`;

  /**
   * In Windows, import() doesn't work without file:// protocol.
   * So, we need to convert path to file:// protocol. (url.pathToFileURL)
   */
  if (process.platform === "win32") {
    return import(withCacheBurst(url.pathToFileURL(manifestFile).href));
  }

  return import(withCacheBurst(manifestFile));
};

export default function makeManifest(config?: { getCacheInvalidationKey?: () => string }): PluginOption {
  function makeManifest(manifest: chrome.runtime.ManifestV3, to: string, cacheKey?: string) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }

    const manifestPath = resolve(to, "manifest.json");

    if (cacheKey) {
      // Naming change for cache invalidation
      for (const script of manifest.content_scripts) {
        script.css = script.css.map((css) => css.replace("<KEY>", cacheKey));
      }
    }

    fs.writeFileSync(manifestPath, ManifestParser.convertManifestToString(manifest));

    colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
  }

  return {
    name: "make-manifest",
    buildStart() {
      this.addWatchFile(manifestFile);
    },
    async writeBundle() {
      const invalidationKey = config.getCacheInvalidationKey?.();
      const manifest = await getManifestWithCacheBurst();

      makeManifest(manifest.default, distDir, invalidationKey);
    },
  };
}
