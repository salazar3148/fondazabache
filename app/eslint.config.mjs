import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']),

  {
    // docs/04 §6 — reglas propias del proyecto
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',

      // Accesibilidad en modo estricto: es una carta pública
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-autofocus': 'error',
    },
  },

  {
    // ADR-005 · Zod es solo para build y tests. No entra al bundle.
    files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}', 'src/hooks/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'zod', message: 'Zod es solo build/tests. Ver docs/04 ADR-005.' }],
          patterns: ['@/lib/schemas'],
        },
      ],
    },
  },

  {
    // Los scripts de build sí pueden usar Zod y console
    files: ['scripts/**/*.ts', 'tests/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
]);

export default eslintConfig;
