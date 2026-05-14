# Environment Configuration

| Variable | Required | Example | Purpose | Security |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_TORO_NETWORK` | Optional | `testnet` | Selects `testnet` or `mainnet` SDK configuration. Defaults to `testnet`. | Public because the selected network is safe to show in UI. |
| `NEXT_PUBLIC_TORONET_NETWORK` | Optional | `testnet` | Backward-compatible alias for network selection. | Public. Prefer `NEXT_PUBLIC_TORO_NETWORK` in new deployments. |
| `TORO_API_URL` | Optional | `https://testnet.toronet.org/api` | Server-side custom SDK base URL for controlled environments. | Keep server-only. Use this instead of exposing upstream URLs to the browser. |
| `NEXT_PUBLIC_TORO_API_URL` | Optional | empty | Legacy public base URL fallback. | Avoid for production unless there is a clear reason to expose it. |
| `TORO_REQUEST_TIMEOUT_MS` | Optional | `15000` | Gateway timeout for SDK calls. | Server-side operational setting. |
| `TORO_RATE_LIMIT_WINDOW_MS` | Optional | `60000` | API route rate limit window. | Server-side operational setting. |
| `TORO_RATE_LIMIT_MAX` | Optional | `60` | Max requests per route scope and client IP per window. | Server-side operational setting. |

Production deployments should configure network and API URL per environment. Do not put wallet private keys, admin passwords, or write-capable Toronet credentials in `NEXT_PUBLIC_*` variables.
