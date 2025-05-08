import type { Config } from "tailwindcss";

export default {
  darkMode: false,
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: [
        "-apple-system",
        "BlinkMacSystemFont",
        "Inter",
        "Helvetica",
        "sans-serif",
      ],
      serif: ["Georgia", "serif"],
      mono: ["JetBrains Mono", "monospace"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      gray: {
        50: "#fafafa",
        100: "#f4f4f4",
        200: "#e9e9e9",
        300: "#d9d9d9",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
      },
    },
    extend: {
      colors: {
        border: "#e9e9e9",
        input: "#e9e9e9",
        ring: "#000000",
        background: "#ffffff",
        foreground: "#000000",
        primary: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f4f4f4",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#000000",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f4f4f4",
          foreground: "#525252",
        },
        accent: {
          DEFAULT: "#fafafa",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "#000000",
          primary: "#000000",
          "primary-foreground": "#ffffff",
          accent: "#fafafa",
          "accent-foreground": "#000000",
          border: "#e9e9e9",
          ring: "#000000",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "background-shine": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(10px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
        float: "float 3s ease-in-out infinite",
        "background-shine": "background-shine 2s linear infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
      boxShadow: {
        premium: "0 1px 3px rgba(0, 0, 0, 0.05)",
        "premium-lg": "0 4px 12px rgba(0, 0, 0, 0.05)",
        "premium-xl": "0 8px 24px rgba(0, 0, 0, 0.05)",
        magic: "0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05)",
        "magic-hover":
          "0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-shine":
          "linear-gradient(to right, transparent, rgba(0, 0, 0, 0.03), transparent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
