/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1E3A5F",
          foreground: "#FFFFFF",
          50: "#E8EDF3",
          100: "#D1DBE7",
          200: "#A3B7CF",
          300: "#7593B7",
          400: "#476F9F",
          500: "#1E3A5F",
          600: "#182E4C",
          700: "#122339",
          800: "#0C1726",
          900: "#060C13",
        },
        secondary: {
          DEFAULT: "#2980B9",
          foreground: "#FFFFFF",
          50: "#EBF4FA",
          100: "#D7E9F5",
          200: "#AFD3EB",
          300: "#87BDE1",
          400: "#5FA7D7",
          500: "#2980B9",
          600: "#216694",
          700: "#194D6F",
          800: "#10334A",
          900: "#081A25",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
