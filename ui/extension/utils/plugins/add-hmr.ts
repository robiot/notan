/* eslint-disable sonarjs/cognitive-complexity */
import { readFileSync } from "node:fs";
import * as path from "node:path";
import type { PluginOption } from "vite";

const isDevelopment = process.env.__DEV__ === "true";

const DUMMY_CODE = "export default function(){};";

function getInjectionCode(fileName: string): string {
  return readFileSync(path.resolve(__dirname, "..", "reload", "injections", fileName), { encoding: "utf8" });
}

type Config = {
  background?: boolean;
  view?: boolean;
};

export default function addHmr(config?: Config): PluginOption {
  const { background = false, view = true } = config || {};
  const idInBackgroundScript = "virtual:reload-on-update-in-background-script";
  const idInView = "virtual:reload-on-update-in-view";

  const scriptHmrCode = isDevelopment ? getInjectionCode("script.js") : DUMMY_CODE;
  const viewHmrCode = isDevelopment ? getInjectionCode("view.js") : DUMMY_CODE;

  return {
    name: "add-hmr",
    resolveId(id) {
      if (id === idInBackgroundScript || id === idInView) {
        return getResolvedId(id);
      }
    },
    load(id) {
      if (id === getResolvedId(idInBackgroundScript)) {
        return background ? scriptHmrCode : DUMMY_CODE;
      }

      if (id === getResolvedId(idInView)) {
        return view ? viewHmrCode : DUMMY_CODE;
      }
    },
  };
}

function getResolvedId(id: string) {
  return "\0" + id;
}
