import packageJson from "./package.json" assert { type: "json" };

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  name: "Notan",
  version: packageJson.version,
  description: "The browser extension for seamless, page-specific note-taking.",
  permissions: ["tabs", "cookies"],
  action: {
    default_popup: "src/core/popup/index.html",
    default_icon: "icon-34.png",
  },
  icons: {
    128: "icon-128.png",
  },
  content_scripts: [],
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "icon-128.png", "icon-34.png"],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
