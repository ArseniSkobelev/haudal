/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        bg_color: "#F4F3EF",
        primary_color: "#59B1EE",
        secondary_color: "#845DAB",
        subtle_element_color: "#D9D9D9",
        nav_bar_color: "#2B2B2B",
        alert_success: "#C2F8A9",
        alert_error: "#E33E3E",
        alert_danger: "#E81919"
      },
      backgroundImage: {
        'login_screen': "url('https://images.pexels.com/photos/2909077/pexels-photo-2909077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
      }
    },
  },
  plugins: [],
}
