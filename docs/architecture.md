# ToroLens Architecture

ToroLens is structured as a Toronet reference application, not a browser-only explorer. The important rule is simple: product code should never import `torosdk` directly unless it lives inside the gateway.

## Boundaries

- `app/api/*` contains Next.js Route Handlers. They validate input, enforce rate limits, and return sanitized JSON.
- `libs/server/*` contains server-only request lifecycle utilities: validation, rate limiting, and API error shaping.
- `libs/toronet/gateway.ts` is the Toronet boundary. It initializes the official SDK, owns timeout handling, classifies upstream failures, and exposes named operations.
- `libs/toronet/queries.ts` composes gateway calls into product use cases such as wallet overview, transaction details, and network summary.
- `libs/toronet/mappers.ts` normalizes upstream payloads into stable ToroLens contracts.
- `hooks/*` and `components/*` consume only ToroLens API routes and normalized client types.

## SDK-First Policy

The official `torosdk` package is the primary integration mechanism. Direct API calls are not used in the current implementation because SDK coverage exists for balances, transactions, roles, TNS resolution, receipts, revert reasons, and network summaries.

If a future Toronet capability is missing from the SDK, add an isolated adapter inside `libs/toronet/gateway.ts`, include a comment explaining the SDK gap, and return the same normalized error model used by SDK calls. Do not call raw Toronet APIs from routes, hooks, or components.

## Request Lifecycle

1. Client hook calls a ToroLens API route.
2. Route Handler validates query params with Zod.
3. Route Handler applies an in-memory rate limit for local/serverless protection.
4. Query service composes one or more gateway operations.
5. Gateway invokes `torosdk` with timeout and error classification.
6. Mapper converts upstream payloads into stable UI contracts.
7. Route returns sanitized data or a sanitized error envelope.

## Extension Pattern

To add a new Toronet query:

1. Add a method to `toronetGateway`.
2. Add or extend a mapper for the normalized contract.
3. Add a query function in `libs/toronet/queries.ts`.
4. Add a Route Handler under `app/api`.
5. Add a client fetcher and React Query hook.
6. Render the new surface in a component.
7. Add validation tests for malformed inputs and mapper tests for upstream shape changes.
