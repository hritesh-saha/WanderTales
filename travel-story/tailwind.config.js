/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{jsx,js,ts,tsx}"],
  theme: {
    fontFamily:{
      display: ["Poppins", "sans-serif"],
    },
    extend: {
      //Colors used in Project
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E",
      },
      backgroundImage:{
        'login-bg-img':"url(./src/assets/bg-image.jpg)",
        'signup-bg-img':"url(./src/assets/signup-bg-img.png)",
      },
    },
  },
  plugins: [],
}

