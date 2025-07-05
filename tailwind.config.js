/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        colors: {
          'spotify-green': '#1DB954',
          'spotify-dark': '#121212',
          'spotify-lightdark': '#181818',
          'spotify-gray': '#282828',
          'spotify-lightgray': '#B3B3B3',
        }
    },
  },
  plugins: [],
}