/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f3ea",
        ink: "#17211f",
        muted: "#66736f",
        rain: "#2f7ea8",
        flood: "#bd4a36",
        river: "#74b7c9",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "ui-serif", "serif"],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(23, 33, 31, 0.12)",
      },
    },
  },
  plugins: [],
};
