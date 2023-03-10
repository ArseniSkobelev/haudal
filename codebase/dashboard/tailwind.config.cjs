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
        'login_image': "url('/images/login-image.jpg')",
        "signup_image": "url('/images/signup_image.jpg')"
      }
    },
  },
  plugins: [],
}
