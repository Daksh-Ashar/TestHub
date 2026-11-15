# TestHub

## Local checks

Install the repository tooling and both applications' dependencies from the repository root:

```powershell
npm ci
npm ci --prefix frontend
npm ci --prefix backend
```

Installing the root package sets up Husky. Before a commit, staged files are formatted with Prettier and TypeScript files are linted with ESLint. Before a push, Husky builds both applications. Run the pre-push checks manually with:

```powershell
npm run validate
```
