import globals from 'globals'
import pluginJs from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import eslintReact from '@eslint-react/eslint-plugin'

export default defineConfig([
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
  prettierPlugin
])
