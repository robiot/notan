const defaultTheme = require("@notan/components/tailwind.config.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/components/**/*.{ts,tsx}",
  ],
  theme: {
    ...defaultTheme.theme,
    extend: {
      ...defaultTheme.theme.extend,
      backgroundImage: {
        ...defaultTheme.theme.extend.backgroundImage,
        "blue-gradient": "linear-gradient(255deg, #0B4CC0 3.81%, #000 68.26%)",
        "purple-blue-gradient":
          "linear-gradient(255deg, #0B4CC0 3.81%, #470F8D 68.26%)",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
