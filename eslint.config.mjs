// eslint-config-next v16 ships native flat-config arrays — import and spread
// them directly (FlatCompat is no longer needed and breaks on ESLint 9).
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ['.next/**', 'node_modules/**', 'graphify-out/**', 'seed_listings.js', 'scripts/**'],
  },
  {
    // Baseline for an existing codebase that had no linting before. These rules
    // fire only on pre-existing code; they are downgraded (not silenced) so they
    // stay visible without blocking CI. Tighten incrementally over time.
    rules: {
      // Pedantic: escaping apostrophes/quotes in JSX text adds no real safety.
      'react/no-unescaped-entities': 'off',
      // React 19 rules that flag legitimate existing patterns (e.g. reading
      // navigator.connection in an effect). Revisit per-occurrence later.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      // Internal <a> that could be a <Link> — minor, convert opportunistically.
      '@next/next/no-html-link-for-pages': 'warn',
    },
  },
]

export default eslintConfig
