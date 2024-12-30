const flowbitePlugin = require("flowbite/plugin"); // Correct Flowbite plugin import

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Path to your HTML files
    "./src/**/*.{js,ts,jsx,tsx}", 
    "./node_modules/flowbite-react/**/*.js", // Include Flowbite React components
    "./node_modules/tw-elements-react/dist/js/**/*.js", // Include tw-elements React components
  ],
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      screens: {
        mobile: { max: "765px" },
        tablet: { min: "640px", max: "1024px" }, // Optional tablet range
        desktop: { min: "1025px", max: "1280px" },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'fade-in-delayed': 'fadeIn 1.5s ease-in-out 0.5s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      
    },
  },
  plugins: [
    
  ],
};
