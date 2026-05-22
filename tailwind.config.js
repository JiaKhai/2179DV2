/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#edf5f4",
        ink: "#102321",
        muted: "#415a56",
        rain: "#1f7fa3",
        flood: "#b8523d",
        river: "#7fb9c8",
      },
      fontFamily: {
        sans: ["Manrope", "Aptos", "Segoe UI Variable", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "ui-serif", "serif"],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(16, 35, 33, 0.12)",
      },
    },
  },
  plugins: [],
};
