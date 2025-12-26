# Jane SPA App

React + TypeScript + Tailwind + Webpack SPA that calls a Cloudflare Worker.

## Local dev

```bash
yarn install
yarn dev
```

Set the worker URL before building:

```bash
export WORKER_URL=https://api.YOUR_DOMAIN/chat
yarn build
```

## Cloudflare setup

1) **Worker route**
- Choose: `https://api.YOUR_DOMAIN/chat`
- Update `wrangler.toml` with your real domain in the `routes` field.

2) **Cloudflare Pages**
- Create a Pages project named `jane-spa-app` and link to the repo.
- Build command: `yarn build`
- Output directory: `dist`
- Add environment variable `WORKER_URL` in Pages settings (or via GitHub Actions secret).

3) **GitHub Actions secrets**

Add these repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `WORKER_URL` (e.g. `https://api.YOUR_DOMAIN/chat`)

