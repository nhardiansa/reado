/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        clay: {
          bg: "#FFFFFF",
          accent: "#FFD52E",
          "accent-pink": "#FF4FA0",
          success: "#9BE7A1",
          danger: "#FF8A8A",
          text: "#141414",
          border: "#141414",
          card: "#FFFDF7",
        },
      },
      fontFamily: {
        archivo: ["ArchivoBlack_400Regular"],
        jetbrains: ["JetBrainsMono_700Bold"],
      },
      spacing: {
        xs: "4",
        sm: "8",
        md: "16",
        lg: "24",
        xl: "32",
      },
      borderRadius: {
        clay: "8",
        "clay-button": "8",
        "clay-modal": "8",
      },
      borderWidth: {
        clay: "2",
        "clay-emphasized": "3",
      },
      boxShadow: {
        clay: "3 3 0 0 #141414",
        "clay-emphasized": "4 4 0 0 #141414",
      },
    },
  },
  plugins: [],
};
