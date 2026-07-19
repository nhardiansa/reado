/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        clay: {
          bg: "#F8EFD9",
          accent: "#FFB84C",
          secondary: "#A3D8F4",
          success: "#9BE7A1",
          danger: "#FF8A8A",
          text: "#1E1E1E",
          border: "#1E1E1E",
          card: "#FFF7E6",
        },
      },
      spacing: {
        xs: "4",
        sm: "8",
        md: "16",
        lg: "24",
        xl: "32",
      },
      borderRadius: {
        clay: "24",
        "clay-button": "20",
        "clay-modal": "28",
      },
      borderWidth: {
        clay: "2",
        "clay-emphasized": "3",
      },
      boxShadow: {
        clay: "4 4 0 0 rgba(0,0,0,0.85)",
        "clay-emphasized": "6 6 0 0 rgba(0,0,0,0.85)",
      },
    },
  },
  plugins: [],
};
