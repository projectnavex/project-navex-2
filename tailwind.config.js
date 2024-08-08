/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "#346751",
        red: "#c84b31",
        black: "#181818",
        white: "#b3b3b3",
      },
      fontFamily: {
        mono: ["Space Mono"],
      },
    },
  },
  plugins: [],
};
