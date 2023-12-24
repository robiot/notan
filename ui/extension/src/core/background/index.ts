import "webextension-polyfill";

import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("core/background");

console.log("background loaded");

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event: MessageEvent<any>) {
  console.log("event", event.origin);
  //   if (event.origin == "your_extension_id_aeiou12345") {
  //     event.source.postMessage("" + localStorage.auth_token, event.origin);
  //   }
}
