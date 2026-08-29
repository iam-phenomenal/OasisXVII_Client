import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat config, so it is spread directly
// rather than bridged through @eslint/eslintrc's FlatCompat.
const eslintConfig = [
  {
    ignores: [".next/**", "next-env.d.ts"],
  },
  ...coreWebVitals,
  ...typescript,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      // `primary` (#4A0F27) is a fill color. As a foreground it scores
      // between 1.04:1 and 1.26:1 on every surface in the palette — it
      // reads as correct in code and is invisible on screen, which is how
      // it spread to 37 sites before the 2026-08 audit caught it.
      // Use `text-on-surface-primary` (9.28:1 at worst) instead.
      // The `(?![\\w-])` lookahead lets `text-primary-container` and
      // `text-on-surface-primary` through.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/\\b(text|decoration)-primary(?![\\w-])/]",
          message:
            "`primary` is fill-only — it fails WCAG AA as a foreground on every surface. Use `on-surface-primary` instead.",
        },
        {
          selector:
            "TemplateElement[value.raw=/\\b(text|decoration)-primary(?![\\w-])/]",
          message:
            "`primary` is fill-only — it fails WCAG AA as a foreground on every surface. Use `on-surface-primary` instead.",
        },
      ],
    },
  },
];

export default eslintConfig;
