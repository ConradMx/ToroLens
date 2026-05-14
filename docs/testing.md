# Testing Strategy

ToroLens uses layered verification:

- Unit assertions validate route schemas and malformed input handling.
- TypeScript and ESLint guard component, route, and service contracts.
- `next build` verifies App Router and Route Handler compatibility against the installed Next.js version.

Run:

```bash
npm run verify
```

Future test expansion should add mapper regression fixtures for real Toronet payloads, mocked gateway tests for SDK failures/timeouts, and smoke tests for wallet lookup, transaction inspection, and network summary flows.
