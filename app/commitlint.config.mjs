/** docs/04 §6 · Conventional Commits con los scopes del proyecto */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['carta', 'decor', 'menu', 'ruleta', 'content', 'perf', 'a11y', 'docs', 'chore', 'deps'],
    ],
    'subject-case': [0],
  },
};

export default config;
