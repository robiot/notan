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

  theme: defaultTheme.theme,

  plugins: [require("tailwindcss-animate")],
};
