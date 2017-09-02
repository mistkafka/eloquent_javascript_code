module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'warn',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'no-console': 'off',
  },
  globals: {
    it: true,
    describe: true,
    after: true,
    before: true
  }
};
