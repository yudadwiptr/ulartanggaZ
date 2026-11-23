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
        skyIsland: {
          bg: "#F8FAFC",
          sky: "#E0F2FE",
          wood: "#8B5A2B",
          woodDark: "#5C3A1B",
          woodLight: "#C18E5E",
          meadow: "#86EFAC",
          meadowDeep: "#22C55E",
          sand: "#FEF08A",
          sandWarm: "#FDE047",
        },
      },
      boxShadow: {
        tabletop: "0 10px 0 0 #5C3A1B, 0 18px 30px rgba(0,0,0,0.18)",
        card3d: "0 5px 0 0 rgba(15, 23, 42, 0.14)",
        btn3d: "0 6px 0 0 #0284c7",
      },
    },
  },
  plugins: [],
};
export default config;
