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

## Cloudflare setup (no GitHub Actions)

1) **Connect Pages**
- Cloudflare Dashboard → Pages → Create project → Connect to your GitHub repo.
- Build command: `yarn build`
- Output directory: `dist`
- Environment variable: `WORKER_URL=https://api.janebingley.cc/chat`

2) **Connect Worker**
- Cloudflare Dashboard → Workers & Pages → Workers → Create → Connect to your GitHub repo.
- It will pick up `wrangler.toml` and deploy the Worker on pushes.

3) **Worker route**
- Ensure `wrangler.toml` uses `https://api.janebingley.cc/chat*` in the `routes` field.

4) **Worker secret**
- Store your OpenAI API key as a Worker secret:
  - `npx wrangler secret put OPENAI_API_KEY`
