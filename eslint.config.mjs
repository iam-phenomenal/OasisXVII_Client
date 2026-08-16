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
];

export default eslintConfig;
