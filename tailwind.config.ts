import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    listStyleType: {
      none: "none",
      disc: "disc",
      decimal: "decimal",
    },
    fontFamily: {
      display: "var(--raleway-font)",
    },
    extend: {
      colors: {
        lightYellow: "#ffc800",
        darkYellow: "#e07700",
      },
    },
  },
  plugins: [],
} satisfies Config;
