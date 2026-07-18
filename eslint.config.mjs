import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import next from 'eslint-config-next';
import unusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**

*/*', '!@mui/material/test-utils/*'],
      }],
      'import/extensions': 'off',
      'import/order': 'off',
      'import/no-unresolved': ['error', { ignore: ['^@'] }],
      'unused-imports/no-unused-imports': 'warn',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
);