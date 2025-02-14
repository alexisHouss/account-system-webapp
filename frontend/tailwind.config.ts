// tailwind.config.js

const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/globals.scss",
    './node_modules/preline/dist/*.js', // <-- Problematic entry
  ],
  variants: {},
  plugins: [
    require("tailwindcss"),
    require("@tailwindcss/forms"),
    require("tailwind-clip-path"),
    require("preline/plugin"),
    plugin(function ({ addComponents }: any) {
      addComponents({
        ".dirrtl": {
          direction: "ltr",
        },
        ".dir-rtl": {
          direction: "rtl",
        },
        ".dir-ltr": {
          direction: "ltr",
        },
      });
    }),
  ],
};
