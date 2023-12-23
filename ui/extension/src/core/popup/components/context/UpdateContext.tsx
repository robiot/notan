import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { FC, ReactNode } from "react";
import semver from "semver";

import { useVersionInfo } from "../../hooks/updates/useVersionInfo";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

export const UpdateContext: FC<{ children?: ReactNode }> = ({ children }) => {
  const versionInfo = useVersionInfo();

  const updateCheck = useMutation({
    mutationFn: () => {
      return new Promise((resolve) => {
        chrome.runtime.requestUpdateCheck((status) => {
          console.log("Update status:", status);

          if (status === "update_available") {
            chrome.runtime.reload();
          }

          resolve(status);
        });
      });
    },
  });

  useEffect(() => {
    if (!versionInfo.data) return;

    // if required version is more than current version then update is available
    const { required_version } = versionInfo.data;
    const current_version = chrome.runtime.getManifest().version;

    if (semver.gt(required_version, current_version)) {
      console.log(`An update is required. Current version: ${current_version}, Required version: ${required_version}`);
      toast({
        variant: "destructive",
        title: "Required update available",
        description: "Please update the extension.",
        action: (
          <Button
            onClick={() => {
              updateCheck.mutate();
            }}
            loading={updateCheck.isPending}>
            Update
          </Button>
        ),
      });
    } else {
      console.log("No update is required.");
    }
  }, [versionInfo.data]);

  return <>{children}</>;
};
