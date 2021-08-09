module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import',
    'eslint-plugin-no-null',
    'eslint-plugin-prefer-arrow',
    'eslint-plugin-jsdoc',
  ],
  rules: {
    // Disabling rules like this is a terrible terrible idea but I want to
    // rewrite booru and don't feel like fixing all these eslint warnings right
    // now
    // This was written when I was initially working with Typescript, I've
    // gotten much better at properly using it now (and also working with
    // eslint from the beginning)
    // So next version expect better type safety 😎
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}
