/** @type {import('tailwindcss').Config} */
// Design tokens are lifted verbatim from
// design-reference/calm_regulatory_intelligence/DESIGN.md and the per-screen
// Tailwind config embedded in each reference `code.html`.
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Structural palette
        primary: '#004541',
        'primary-container': '#115e59',
        'on-primary': '#ffffff',
        'on-primary-container': '#91d5ce',
        'inverse-primary': '#8fd3cc',
        'primary-fixed': '#abefe8',
        'primary-fixed-dim': '#8fd3cc',
        'on-primary-fixed': '#00201e',
        'on-primary-fixed-variant': '#00504b',

        secondary: '#006b5f',
        'secondary-container': '#6df5e1',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#006f64',
        'secondary-fixed': '#71f8e4',
        'secondary-fixed-dim': '#4fdbc8',
        'on-secondary-fixed': '#00201c',
        'on-secondary-fixed-variant': '#005048',

        tertiary: '#221eb5',
        'tertiary-container': '#3e3ecb',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#c3c3ff',
        'tertiary-fixed': '#e1e0ff',
        'tertiary-fixed-dim': '#c0c1ff',
        'on-tertiary-fixed': '#07006c',
        'on-tertiary-fixed-variant': '#2f2ebe',

        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        background: '#f2fcf8',
        'on-background': '#141d1b',
        surface: '#f2fcf8',
        'surface-dim': '#d2dcd9',
        'surface-bright': '#f2fcf8',
        'surface-variant': '#dbe5e1',
        'surface-tint': '#216963',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#ecf6f2',
        'surface-container': '#e6f0ec',
        'surface-container-high': '#e0eae7',
        'surface-container-highest': '#dbe5e1',
        'on-surface': '#141d1b',
        'on-surface-variant': '#3f4947',
        'inverse-surface': '#293230',
        'inverse-on-surface': '#e9f3ef',
        outline: '#6f7977',
        'outline-variant': '#bec9c7',

        // Functional states (DESIGN.md §Colors)
        'state-success': '#15803d',
        'state-warning': '#b45309',
        'state-critical': '#b91c1c',
        'state-metadata': '#64748b',
        'ai-indigo': '#6366f1',
        'accent-teal': '#14b8a6',
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
        gutter: '1.5rem',
        'gutter-mobile': '1rem',
        margin: '2rem',
        'margin-mobile': '1rem',
      },
      fontSize: {
        'headline-xl': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.02em', fontWeight: '500' }],
        'headline-xl-mobile': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.015em', fontWeight: '500' }],
        'headline-lg': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.015em', fontWeight: '500' }],
        'headline-lg-mobile': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em', fontWeight: '500' }],
        'headline-md': ['1.375rem', { lineHeight: '1.875rem', fontWeight: '600' }],
        'headline-sm': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'body-md': ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'label-md': ['0.8125rem', { lineHeight: '1rem', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['0.6875rem', { lineHeight: '0.875rem', letterSpacing: '0.06em', fontWeight: '700' }],
        'code-tabular': ['0.8125rem', { lineHeight: '1.125rem', fontWeight: '500' }],
      },
      boxShadow: {
        // DESIGN.md §Elevation & Depth
        dossier: '0 4px 20px -2px rgba(17, 94, 89, 0.06), 0 2px 6px -1px rgba(23, 32, 30, 0.04)',
        modal: '0 12px 32px -4px rgba(17, 94, 89, 0.12)',
        sm: '0 1px 2px 0 rgba(23, 32, 30, 0.05)',
      },
      maxWidth: {
        measure: '72ch',
      },
    },
  },
  plugins: [],
};