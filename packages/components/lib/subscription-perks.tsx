import { Book, Check, CheckCircle, Edit, X, XCircle } from "lucide-react";

export const SubscrtiptionPerks = {
  premium: [
    {
      icon: <Check />,
      text: "Unlimited tags",
    },
    {
      icon: <Check />,
      text: "No limits per domain",
    },
    {
      icon: <Check />,
      text: "Unlimited notes",
    },
    {
      icon: <Check />,
      text: "Unlimited note length",
    },
  ],
  plus: [
    {
      icon: <Check />,
      text: "Up to 15 tags",
    },
    {
      icon: <Check />,
      text: "20 notes per domain",
    },
    {
      icon: <Check />,
      text: "Unlimited notes",
    },
    {
      icon: <Check />,
      text: "Unlimited note length",
    },
  ],
  free: [
    {
      icon: <Check />,
      text: "Up to 5 tags",
    },
    {
      icon: <Check />,
      text: "5 notes per domain",
    },
    {
      icon: <X />,
      text: "Unlimited notes",
    },
    {
      icon: <X />,
      text: "Unlimited note length",
    },
  ],
};
