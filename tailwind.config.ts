import type { Config } from "tailwindcss";

/**
 * Oasis XVII — Canonical Design Token Config
 * "Streetwear x Viticulture" / "The Underground Sommelier"
 *
 * Consolidated from:
 *   - stitch_remix_of_oasisxvii/vintage_noir/DESIGN.md  (authoritative)
 *   - All six HTML mockups (home, shop, product, cart ×2, checkout)
 *
 * Conflict resolution: DESIGN.md wins over individual mockup values.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // ─── Border Radius ───────────────────────────────────────────────────────
    // Aggressive Minimalism: sharp by default; only CTA buttons get rounded.
    borderRadius: {
      none: "0px",
      DEFAULT: "0px",
      sm: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      full: "9999px",
      btn: "12px", // DESIGN.md: "xl (12px) radius" for primary/secondary buttons
    },
    extend: {
      // ─── Colors ────────────────────────────────────────────────────────────
      colors: {
        // Surface hierarchy — "The Layering Principle"
        // Use tonal shifts instead of borders to define depth.
        "surface-container-lowest": "#0E0E13", // deepest void
        background: "#0F0F14",                 // grain overlay base
        surface: "#131318",                    // DESIGN.md "Base Background"
        "surface-container-low": "#1B1B20",    // DESIGN.md explicit token
        "surface-container": "#18181F",
        "surface-container-high": "#22222B",
        "surface-container-highest": "#2D2D38",

        // Primary — Deep Wine
        // DESIGN.md authority: #4A0F27
        primary: "#4A0F27",
        // FILL ONLY. As a foreground `primary` lands between 1.04:1 and
        // 1.26:1 on every surface in this palette — use `on-surface-primary`
        // for wine-colored text, icons and hover states instead.
        "primary-container": "#5D111F",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#FFFFFF",
        "primary-hover": "#B21E42",            // DESIGN.md "Hover/Active Wine"

        // Secondary — Wine Glow Source
        // DESIGN.md §2: "secondary_container (#8A1A49) — used for Wine Glow blur"
        secondary: "#8A1A49",
        "secondary-container": "#8A1A49",
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#FFFFFF",

        // Tertiary — Vintage Tag chip
        // DESIGN.md §5: "tertiary_fixed_dim (#FFB2BD)" — the "security tag" accent
        tertiary: "#FFB2BD",
        "tertiary-fixed-dim": "#FFB2BD",
        "tertiary-container": "#5D111F",
        "on-tertiary": "#3B0000",
        "on-tertiary-container": "#FFDAD9",

        // Accent — Neon Highlight (use sparingly, <2% of UI)
        accent: "#FF2D6F",                     // DESIGN.md "On Tertiary Container"

        // Text
        // DESIGN.md: "Don't Use Pure White — use on_surface (#E4E1E9)"
        "on-surface": "#E4E1E9",
        "on-surface-variant": "#A0A0B0",
        // Foreground form of the wine family: 9.28:1 at worst (on
        // surface-container-high), so it clears AA on every surface.
        // Shares a value with `tertiary` by design — that token is the
        // Vintage Tag chip, this one is text, and they can diverge later.
        "on-surface-primary": "#FFB2BD",
        "on-background": "#E4E1E9",

        // Outline — ghost borders only, applied at low opacity
        outline: "#777575",
        "outline-variant": "#34343D",          // DESIGN.md: ghost border at 15% opacity

        // Inverse
        "inverse-surface": "#E4E1E9",
        "inverse-on-surface": "#131318",
        "inverse-primary": "#B21E42",

        // Error
        error: "#FF716C",
        "error-container": "#9F0519",
        "on-error": "#490006",
        "on-error-container": "#FFA8A3",
      },

      // ─── Typography ────────────────────────────────────────────────────────
      // DESIGN.md: Display = Epilogue/Bebas Neue (bold editorial headers)
      //            Body    = Inter (functional counter-balance)
      //            Space Grotesk used as headline across most mockups.
      fontFamily: {
        serif:    ["var(--font-serif)", "Georgia", "serif"],
        display:  ["var(--font-display)", "Bebas Neue", "sans-serif"],
        headline: ["var(--font-headline)", "sans-serif"],
        body:     ["var(--font-body)", "sans-serif"],
        label:    ["var(--font-headline)", "sans-serif"],
      },

      // ─── Label Type Scale ──────────────────────────────────────────────────
      // The uppercase micro-labels (eyebrows, chips, footer headings, table of
      // contents) were 33 x text-[10px] plus one-off [9px] and [11px]. Hoisted
      // at their shipped values — Phase 2 owns whether these values are right.
      fontSize: {
        "label-sm": "0.5625rem", // 9px
        label: "0.625rem",       // 10px
        "label-lg": "0.6875rem", // 11px
      },

      // ─── Label Tracking ────────────────────────────────────────────────────
      // 23 arbitrary tracking values across 5 distinct steps. Same rule: hoisted
      // at shipped values, Phase 2 decides the direction's real scale.
      letterSpacing: {
        label: "0.2em",
        "label-md": "0.25em",
        "label-lg": "0.3em",
        "label-xl": "0.4em",
        "label-2xl": "0.5em",
      },

      // ─── Box Shadows ───────────────────────────────────────────────────────
      // DESIGN.md: No grey shadows. All depth = wine-tinted glow.
      boxShadow: {
        // Standard wine glow: 30-60px blur of secondary-container (#8A1A49)
        "wine-glow": "0 0 40px rgba(138, 26, 73, 0.4)",
        "wine-glow-hover": "0 0 50px rgba(178, 30, 66, 0.5)",
        // Ambient: for modals/dropdowns — tinted #4A0F27 at 8% opacity, 40px blur
        "wine-ambient": "0 0 40px rgba(74, 15, 39, 0.08)",
      },

      // ─── Drop Shadows ──────────────────────────────────────────────────────
      dropShadow: {
        // Hero headline legibility over a server-driven photograph. Was inline
        // on page.tsx as drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)].
        hero: "0 5px 15px rgba(0, 0, 0, 0.8)",
      },

      // ─── Spacing ───────────────────────────────────────────────────────────
      // DESIGN.md "Aggressive Minimalism" spacing: vast section padding,
      // tight internal blocks.
      spacing: {
        section: "8.5rem",  // DESIGN.md: "8.5rem (24) vertical section padding"
        block: "0.7rem",    // DESIGN.md: "0.7rem (2) heading-to-subtext gap"
      },

      // ─── Backdrop Blur ─────────────────────────────────────────────────────
      backdropBlur: {
        nav: "20px", // DESIGN.md: glassmorphism nav = 20px backdrop-blur
      },
    },
  },
  plugins: [],
};

export default config;
