/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit', // just-in-time
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    container: {
      center: true
    },
    screens: {
      'xs': '576px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  // variants: {
  //   extend: {
  //       display: ["group-hover"],
  //       opacity: ["group-hover"],
  //   },
  // },
  plugins: [],
}
