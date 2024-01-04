import dotenv from "dotenv";
dotenv.config();
import packageJson from "../../package.json" assert { type: "json" };

type Manifest = chrome.runtime.ManifestV3;

const getHostPermissions = () => {
  if (process.env.VITE_APP_URL) {
    const url = new URL(process.env.VITE_APP_URL);

    return [`*://*.${url.hostname}/`];
  }

  return [];
};

class ManifestParser {
  private constructor() {}

  static convertManifestToString(manifest: Manifest): string {
    manifest.host_permissions = getHostPermissions();

    if (process.env.__FIREFOX__) {
      manifest = this.convertToFirefoxCompatibleManifest(manifest);
    }

    manifest.version = process.env.EXT_VERSION || packageJson.version;

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

    // manifestCopy.content_security_policy = {
    //   extension_pages: "script-src 'self'; object-src 'self'",
    // };

    // Change to manifest version 2

    manifestCopy.manifest_version = 2;

    // host permissions are defined inside of permissions in manifest v2
    manifestCopy.permissions = [
      ...(manifestCopy.permissions as string[]),
      ...(manifestCopy.host_permissions as string[]),
    ];
    delete manifestCopy.host_permissions;

    manifestCopy.web_accessible_resources = (
      manifestCopy.web_accessible_resources as { resources: string[] }[]
    ).flatMap((item) => item.resources);

    manifestCopy.browser_action = manifestCopy.action;
    delete manifestCopy.action;

    // do the rest to convert to manifest v2

    return manifestCopy as Manifest;
  }
}

export default ManifestParser;
