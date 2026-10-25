# Contributing

Use Node.js 22 and install with `npm ci`. Keep changes focused and describe the user behavior affected.

Before opening a pull request:

```sh
npm run format
npm run check:content
npm run build
npx playwright install chromium
npm run test:e2e
```

For a notebook edit, update both the notebook and corresponding `data/labSteps.json` entry. Keep test examples separate from training examples. Mark illustrative values as simulations and cite primary documentation for technical claims.

Include the problem, implementation decision, validation performed, and any remaining limitations in the pull request. Browser tests use local fixtures and must not call paid model APIs.
