import { Pocket } from "lucide-react";

export const NavigationLinks = [
  {
    name: "My account",
    to: "/account",
  },
  {
    name: "Upgrade",
    to: "/upgrade",
    icon: <Pocket className="w-5" />,
  },
  {
    name: "Billing",
    to: "/billing",
  },
];
