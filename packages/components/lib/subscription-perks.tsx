import { Book, CheckCircle, Edit, XCircle } from "lucide-react";

export const SubscrtiptionPerks = {
  premium: [
    {
      icon: <Book />,
      text: "2500 notes",
    },
    {
      icon: <Edit />,
      text: "5000 max note length",
    },
    {
      icon: <CheckCircle />,
      text: "No note limit per domain!",
      tooltip: "By default you can only create 10 notes for ex. wikipedia.com",
    },
  ],
  plus: [
    {
      icon: <Book />,
      text: "190 notes",
    },
    {
      icon: <Edit />,
      text: "900 max note length",
    },
    {
      icon: <CheckCircle />,
      text: "No note limit per domain!",
      tooltip: "By default you can only create 10 notes for ex. wikipedia.com",
    },
  ],
  free: [
    {
      icon: <Book />,
      text: "25 notes",
    },
    {
      icon: <Edit />,
      text: "300 max note length",
    },
    {
      icon: <CheckCircle />,
      text: "10 notes per domain",
    },
  ],
};
