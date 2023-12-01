import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <div className="flex flex-col flex-1">
      <Outlet />
    </div>
  );
};
