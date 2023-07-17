module.exports = {
  extends: 'airbnb-base',
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
  },
};
