# Henrik Sturcz — Portfolio

Vite + React portfolio. Vercelre deploy-olható.

## Indítás

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tartalom szerkesztése

Minden szöveg, név, projekt, social link egy helyen:

```
src/data/site.js
```

## Deploy — Vercel

1. GitHub-ra push
2. Vercel-en import
3. Framework: **Vite**
4. Build: `npm run build` / Output: `dist`

Biztonsági fejlécek (CSP, HSTS, XSS, X-Frame) és cache szabályok automatikusan betöltődnek a `vercel.json`-ból.
