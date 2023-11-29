import "webextension-polyfill";

import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("core/background");

console.log("background loaded");
