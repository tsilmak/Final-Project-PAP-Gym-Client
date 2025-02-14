/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import flowbitePlugin from "flowbite/plugin";

/** @type {Config} */
const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "full-white": "#fff",
        "partial-black": "#191F45",
        "selected-background": "#ffe3a3",
        "gray-20": "#f6f6f6",
        "gray-50": "#FAF9F6",
        "gray-100": "#21295c",
        "gray-200": "#4d547d", // Not gray
        "primary-100": "#d3d4de",
        "primary-300": "#7a7f9d",
        "primary-500": "#21295c",
        "primary-700": "#141937",
        "secondary-200": "#ffedc2",
        "secondary-400": "#ffda85",
        "secondary-500": "#ffd166",
        "secondary-600": "#ffad00",
        "secondary-700": "#c19a6b",
        "background-color": "#191F45",
        "background-color-light": "#f4f5fb",
        "background-alt": "#21295c",
        "background-alt-light": "#f8f8fc",
        "purple-main": "#58449A",
      },
      fontFamily: {
        dmsans: ["DM Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
    screens: {
      xs: "480px", // small mobile devices
      sm: "640px", // medium mobile devices (like larger phones)
      md: "768px", // tablets or small laptops
      lg: "1024px", // larger laptops or small desktop monitors
      xl: "1280px", // large desktops
      "2xl": "1536px", // extra large screens (like ultra-wide desktops)
    },
  },
  plugins: [
    flowbitePlugin, // Use the imported Flowbite plugin
  ],
};

export default config;
