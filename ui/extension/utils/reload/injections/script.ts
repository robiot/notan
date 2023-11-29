import initReloadClient from "../initReloadClient";

export default function addHmrIntoScript(watchPath: string) {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const reload = () => {
    chrome.runtime.reload();
  };

  initReloadClient({
    watchPath,
    onUpdate: reload,
    onForceReload: reload,
  });
}
