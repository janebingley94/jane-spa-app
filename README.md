# Jane SPA App

React + TypeScript + Tailwind + Webpack SPA that calls a Cloudflare Worker.

## Local dev

```bash
yarn install
yarn dev
```

Set the worker URL before building:

```bash
export WORKER_URL=https://api.janebingley.cc/chat
yarn build
```

## Cloudflare setup

1) **Worker route**
- Choose: `https://api.janebingley.cc/chat`
- Ensure `wrangler.toml` uses `https://api.janebingley.cc/chat*` in the `routes` field.

2) **Cloudflare Pages**
- Create a Pages project named `jane-spa-app` and link to the repo.
- Build command: `yarn build`
- Output directory: `dist`
- Add environment variable `WORKER_URL` in Pages settings (or via GitHub Actions secret).

3) **GitHub Actions secrets**

Add these repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `WORKER_URL` (e.g. `https://api.janebingley.cc/chat`)
