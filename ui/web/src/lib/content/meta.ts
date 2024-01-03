import { getBillingMail } from "../mail";

export const MetaTitle =
  "Notan | Take notes for your current page without leaving the browser";

export const MetaDescription =
  "Notan is the browser extension for saving notes for web pages. It's a simple and fast way to take notes without leaving the browser.";

export const FAQ = [
  {
    question: "What is Notan?",
    answer:
      "Notan is the browser extension for saving notes for web pages. It's a simple and fast way to take notes without leaving the browser.",
  },
  {
    question: "How do I use Notan?",
    answer:
      "Notan is a browser extension. You can install it from the Chrome Web Store. Once installed, you can click on the Notan icon in the browser toolbar to open the Notan sidebar. You can then add notes for the current page.",
  },
  {
    question: "Can I open the link for a note somehow?",
    answer:
      "Yes, you can. By dragging the note into a new tab or into the search bar, you can open the link for the note.",
  },
  {
    question: "Can I edit a note?",
    answer:
      "Yes, editing notes is possible. By clicking on the note and clicking edit, you will be able to edit the note.",
  },
  {
    question: "My card was denied when starting a subscription?",
    answer:
      "If your card was denied make sure that the CVC code is correct, that the billing address is correct and that you have enough funds on your card. Disable any VPN or adblocker that you might have enabled. If you still have issues, please contact us.",
  },
  {
    question: "How do I report a bug?",
    answer:
      "You can report a bug by logging in, going to your profile and then pressing the 'Report a bug' button in the bottom of the screen.",
  },
  {
    question: "Is it possible to show all of my notes?",
    answer:
      "Yes, it is possible. You can do that by searching for * in the search bar.",
  },
  {
    question: "How do I pin the extension to access it easily?",
    answer:
      "You can pin the extension by right clicking on the extension icon and selecting 'Pin'.",
  },
  {
    question: "Is the payment system secure?",
    answer:
      "Yes, it is secure. We don't store any of your card information. We use Stripe to handle payments. Stripe is one of the most secure payment systems in the world and ensures bank-level security standards.",
  },
  {
    question: "Can I get a refund?",
    answer: `No, we don't offer refunds unless there has been a technical issue. If you belive you have been charged incorrectly, please contact us at ${getBillingMail()}`,
  },
  {
    question: "How can I cancel my subscription",
    answer:
      "You can cancel your subscription by going to your profile, pressing Billing and then pressing the 'Cancel subscription' button.",
  },
];
