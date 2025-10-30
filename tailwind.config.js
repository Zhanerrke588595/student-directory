/** @type {import('tailwindcss').Config} */
module.exports = {
  // Эта строка говорит Tailwind искать классы во всех файлах внутри папки src
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {}, 
  },
  plugins: [], 
}