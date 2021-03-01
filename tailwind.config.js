const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
      'templates/**/*.html.tera',
  ],
  darkMode: false, // or 'media' or 'class'
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
