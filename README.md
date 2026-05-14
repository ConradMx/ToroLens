# ToroLens

ToroLens is a Toronet reference platform for wallet intelligence, transaction inspection, Toronet-native identity resolution, ecosystem analytics, and developer onboarding.

The goal is bigger than wallet lookup: this repo is meant to teach future Toronet builders how to structure a serious SDK-backed web application.

## Features

- Wallet lookup with balances, role metadata, enrollment, KYC visibility, and TNS association.
- Transaction inspection with status, routing, value movement, receipts, revert reasons, timelines, and linked entities.
- Ecosystem analytics through a network summary API.
- SDK-first Toronet gateway with normalized contracts, timeout handling, sanitized errors, validation, and rate limiting.
- Developer reference panels and docs for extending the app.

## Architecture

ToroLens uses Next.js App Router Route Handlers as a backend-for-frontend layer. Browser code calls local API routes, routes validate inputs, query services compose Toronet operations, and `libs/toronet/gateway.ts` is the only layer that imports `torosdk`.

Read [docs/architecture.md](docs/architecture.md) for the full request lifecycle and extension model.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and choose the target network.

```bash
NEXT_PUBLIC_TORO_NETWORK=testnet
TORO_API_URL=https://testnet.toronet.org/api
TORO_REQUEST_TIMEOUT_MS=15000
TORO_RATE_LIMIT_WINDOW_MS=60000
TORO_RATE_LIMIT_MAX=60
```

See [docs/environment.md](docs/environment.md) for every variable, required status, examples, and security notes.

## Verification

```bash
npm run lint
npm run test
npm run build
```

`npm run verify` runs all three.

## SDK Caveats

ToroLens is SDK-first. Direct Toronet API access should be introduced only when the SDK lacks or misroutes a capability, and only inside the gateway with a comment explaining the SDK limitation and replacement path.

Current gateway coverage uses SDK methods for wallet balances, wallet transactions, roles, TNS names, enrollment, KYC status, transaction details, receipts, revert reasons, latest block data, blockchain status, and recent network transactions. Transaction detail and receipt reads include a gateway-contained query fallback for the SDK v0.2.0 `id`/`hash` parameter mismatch on the configured testnet API.

## Extension Guide

To add a new Toronet capability:

1. Add a gateway method in `libs/toronet/gateway.ts`.
2. Normalize the upstream payload in `libs/toronet/mappers.ts`.
3. Compose the product use case in `libs/toronet/queries.ts`.
4. Expose it through `app/api/*/route.ts` with validation and rate limiting.
5. Add a client fetcher, hook, component, and tests.

More examples live in [docs/architecture.md](docs/architecture.md).

## Foundation Positioning

ToroLens is intended to be submitted as ecosystem infrastructure: a canonical Toronet web reference app demonstrating production-grade SDK integration, transaction intelligence, identity resolution, server-side architecture patterns, and developer onboarding workflows.

See [docs/foundation-submission.md](docs/foundation-submission.md).
