module.exports = {
  extends: 'airbnb-base',
  ignorePatterns: ['build/**/*.js'],
  rules: {
    'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
  },
};
