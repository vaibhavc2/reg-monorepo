module.exports = {
  root: true,
  env: { browser: false, es2020: true },
  extends: ['eslint:recommended', 'plugin:import/errors', 'prettier'],
  ignorePatterns: ['dist', '.nx', '.husky', 'node_modules', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['import'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': 1,
    '@typescript-eslint/no-empty-interface': 'off',
    'no-multiple-empty-lines': [2, { max: 3, maxEOF: 1 }],
    'import/no-unresolved': 'off',
    'import/named': 'off',
  },
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: ['**/*.config.ts', '*.cjs', '*.json'],
};
