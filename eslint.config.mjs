import path from "node:path";
import { fileURLToPath } from "node:url";
import  js  from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from '@eslint/compat'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});
export default [
  ...fixupConfigRules(compat.extends("next/core-web-vitals", "next/typescript")),
  {
    name: 'custom-ignores',
    ignores: [
      '.tmp',
      '.next/',
      '**/.git',
      '**/.hg',
      '**/.pnp.*',
      '**/.svn',
      '**/.yarn/**',
      '**/build',
      '**/dist/**',
      '**/node_modules',
      '**/temp',
      'playwright.config.ts',
      'jest.config.js',
      '**/*.min.js',
    ],
  },
]
