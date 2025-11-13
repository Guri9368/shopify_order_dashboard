/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5C6AC4',
        secondary: '#202E78',
      },
    },
  },
  plugins: [],
};
