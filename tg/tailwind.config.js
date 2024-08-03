module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        accent: '#718096',
        background: '#000000', // Черный фон
        header: '#1a202c',
        cosmic: '#0d0d0d', // Дополнительный темный цвет
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
