/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        nav_bg_color: "#2B2B2B",
        primary_color: "#EA6E6E",
        horizontal_line_color: "#D9D9D9",
        nav_link_color: "#D0D0D0",
        create_color: "#5DAB78"
      }
    },
  },
  plugins: [],
}
