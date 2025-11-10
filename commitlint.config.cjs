module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always'],
    'body-max-line-length': [0, 'always'],
    'footer-max-line-length': [0, 'always'],
  },
  ignores: [(message) => message.includes('first commit')],
  defaultIgnores: true,
}
