const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
      'public/**/*.html.tera',
      'public/**/*.css',
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
