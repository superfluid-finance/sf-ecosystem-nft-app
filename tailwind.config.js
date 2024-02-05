/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: "GT-Walsheim",
      },
      colors: {
        darkgray: "rgba(101, 110, 120, 1)",
        "black-2": "rgba(18, 20, 30, 0.87)",
        "sf-green": "rgba(29, 178, 39, 1)",
        "invalid-grey": "#EAEFF4",
        "error-red": "#D22525",
      },
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      md: "1.5rem",
      lg: "2.625rem",
    },
    screens: {
      md: "1080px",
      bigscreen: "1400px",
    },
  },
  plugins: [],
};
