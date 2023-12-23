import { Button } from "@notan/components/ui/button";
import { Pocket } from "lucide-react";
import { Link } from "react-router-dom";

import { createAppUrl } from "../../lib/urlUtils";

export const UpgradeButton = () => {
  return (
    <Button variant="ok" className="flex gap-2 w-full mt-6" asChild>
      <Link to={createAppUrl("/upgrade")} target="_blank">
        Upgrade
        <Pocket className="w-5" />
      </Link>
    </Button>
  );
};
