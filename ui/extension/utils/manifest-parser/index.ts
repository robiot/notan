import dotenv from "dotenv";
dotenv.config();
import packageJson from "../../package.json" assert { type: "json" };

type Manifest = chrome.runtime.ManifestV3;

class ManifestParser {
  private constructor() {}

  static convertManifestToString(manifest: Manifest): string {
    if (process.env.__FIREFOX__) {
      manifest = this.convertToFirefoxCompatibleManifest(manifest);
    }

    manifest.version = process.env.EXT_VERSION || packageJson.version;

    if (process.env.VITE_APP_URL) {
      const url = new URL(process.env.VITE_APP_URL);

      manifest.host_permissions = [`*://*.${url.hostname}/`];
    }

    return JSON.stringify(manifest, null, 2);
  }

  static convertToFirefoxCompatibleManifest(manifest: Manifest) {
    const manifestCopy = {
      ...manifest,
    } as { [key: string]: unknown };

    if (manifest.background?.service_worker) {
      manifestCopy.background = {
        scripts: [manifest.background?.service_worker],
        type: "module",
      };
    }

    if (manifest.options_page) {
      manifestCopy.options_ui = {
        page: manifest.options_page,
        browser_style: false,
      };
      delete manifestCopy.options_page;
    }

    manifestCopy.browser_specific_settings = {
      gecko: {
        id: "addon@notan.ax",
      },
    };

    manifestCopy.content_security_policy = {
      extension_pages: "script-src 'self'; object-src 'self'",
    };

    return manifestCopy as Manifest;
  }
}

export default ManifestParser;
