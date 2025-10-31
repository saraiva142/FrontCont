/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#3b82f6', // Cor primária suave (azul)
        'light-blue': '#eff6ff', // Tom mais claro para fundos
        'gray-bg': '#f9fafb', // Fundo leve
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}

