import globals from 'globals'
import type { Linter } from 'eslint'
import pluginJs from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import eslintReact from '@eslint-react/eslint-plugin'

const config: Linter.FlatConfig[] = defineConfig([
  {
    ignores: ['**/dist/*']
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: import.meta.dirname }
    }
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  eslintReact.configs['recommended-typescript'],
  prettierPlugin,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@eslint-react/no-children-map': 'off',
      '@eslint-react/no-clone-element': 'off',
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off'
    }
  }
])

export default config
