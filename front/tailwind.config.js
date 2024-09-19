/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens: {
      xs: { max: "359px" },

      sm: { min: "360px", max: "579px" },

      md: { min: "580px", max: "767px" },

      lg: { min: "768px", max: "1023px" },

      xl: { min: "1024px", max: "1279px" },

      "2xl": { min: "1280px", max: "1535px" },

      "3xl": { min: "1536px" },
    },
  },
  plugins: [],
};
