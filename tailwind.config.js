module.exports = {
  purge: ["./**/*.html"], // to get minified css
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    backgroundImage: theme => ({
      'hero': "url('/img/background.png')",
      'hero-mobile': "url('/img/background-mobile.svg')"
    })
  },
  variants: {
    extend: {},
  },
  plugins: [],
}