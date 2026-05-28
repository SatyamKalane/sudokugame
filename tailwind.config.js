/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neonPurp: "#a855f7",
        neonCyan: "#06b6d4",
        darkBg: "#0b0f19",
        cardBg: "rgba(20, 27, 45, 0.7)",
      },
      boxShadow: {
        neonGlow: "0 0 15px rgba(6, 182, 212, 0.4)",
        neonRed: "0 0 15px rgba(239, 68, 68, 0.5)",
      }
    },
  },
  plugins: [],
}
