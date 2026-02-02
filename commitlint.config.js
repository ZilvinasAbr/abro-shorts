module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'no-coauthored': (parsed) => {
          const hasCoAuthored = /co-authored-by/i.test(parsed.raw)
          return [!hasCoAuthored, 'Commit messages must not contain "Co-authored-by"']
        }
      }
    }
  ],
  rules: {
    'no-coauthored': [2, 'always']
  }
}
