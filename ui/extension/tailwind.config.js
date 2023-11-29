/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{tsx,ts,js,html}"],
  theme: {
    extend: {
      colors: {
        shark: {
          50: "#f5f6f6",
          100: "#e5e7e8",
          200: "#cdd0d4",
          300: "#aaafb6",
          400: "#808790",
          500: "#656c75",
          600: "#565a64",
          700: "#4a4d54",
          800: "#454850", // search
          900: "#26292E", // input
          950: "#1d1e21", //bg
        },
        "cerulean-blue": {
          50: "#edf8ff",
          100: "#d6eeff",
          200: "#b7e3ff",
          300: "#85d3ff",
          400: "#4cb9ff",
          500: "#2397ff",
          600: "#0b77ff",
          700: "#055ff0",
          800: "#0b4cc0", // button
          900: "#104498",
          950: "#0f2b5c",
        },
        "well-read": {
          50: "#fdf3f3",
          100: "#fbe5e5",
          200: "#f9cfcf",
          300: "#f4adad",
          400: "#eb7e7e",
          500: "#df5454",
          600: "#cb3737",
          700: "#b82e2e", // button
          800: "#8d2727",
          900: "#762626",
          950: "#400f0f",
        },
      },
    },
  },
  plugins: [],
};
