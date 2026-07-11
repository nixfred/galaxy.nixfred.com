// Formatting contract per docs/CI_CD.md 4.1 (format:check is blocking).
export default {
  plugins: ['prettier-plugin-astro'],
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  printWidth: 80,
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
