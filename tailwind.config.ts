import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#FF6B6B", // Example playful color
        secondary: "#4ECDC4",
        accent: "#FFE66D",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"], // We'll set this up later or use default
      },
    },
  },
  plugins: [],
};
export default config;
