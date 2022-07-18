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
  },
  plugins: [],
}
