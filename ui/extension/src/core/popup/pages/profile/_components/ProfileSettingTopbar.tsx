import { FC } from "react";
import { Link } from "react-router-dom";

import { Topbar } from "@/core/popup/components/app/Topbar";
import { Button } from "@/core/popup/components/ui/button";

export const ProfileSettingTopbar: FC<{ onSave: () => void; loading: boolean; canSave: boolean }> = ({
  onSave,
  loading,
  canSave,
}) => {
  return (
    <Topbar>
      <div className="flex flex-1 justify-between">
        <Button variant="ghost" size="lg" asChild>
          <Link to="/profile">BACK</Link>
        </Button>
        <Button variant="ghost" size="lg" loading={loading} onClick={onSave} disabled={!canSave}>
          SAVE
        </Button>
      </div>
    </Topbar>
  );
};
