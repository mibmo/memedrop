const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
      'templates/**/*.html.tera',
  ],
  darkMode: 'class',
  theme: {
    extend: {
        colors: {
            cyan: colors.cyan,
        }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
