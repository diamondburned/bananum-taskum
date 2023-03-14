# bulbremote

<div align="center">
  <img src="./.github/screenshot.png" alt="screenshot" width="400">
</div>

A Tasmota-based remote control for the [Kauf BLF10](https://kaufha.com/blf10/)
smart bulb. May work with other bulbs, but likely not.

## Development

Use of the Nix shell and direnv is recommended.

To develop, set the following environment variables in your `.envrc`:

```sh
export APP_JSONBIN_ID=                  # your jsonbin's bin ID
export APP_JSONBIN_TOKEN=               # your jsonbin's access key (preferably)
export APP_TASMOTA_ADDRESS="0.0.0.0:80" # the address of the bulb
```

Then, run

```sh
npm run dev
```

## Running

First, build the frontend:

```sh
npm run build
```

This builds them into `dist`. Move/copy the contents to any file server.

Then, configure the backend. The backend is implemented trivially, so you can do
all of it using just Caddy. See the [Caddyfile](./Caddyfile) for an example. The
Caddyfile requires all the environment variables above.

For a backend implementation in JS, see the
[./src/api-server.ts](./src/api-server.ts) middleware that implements the
backend for the Vite development server.
