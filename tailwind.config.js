/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#7e7e7e',
        accent: '#34d399',
        background: '#ffffff',
        surface: '#1f2937',
        text: '#000000',
        'text-secondary': '#ffffff',
      },
    },
  },
  plugins: [],
}

