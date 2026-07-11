# Two of Us — Online Photobooth

A React app that lets two people video-call each other (laptop + phone, or phone + phone) and
capture a shared photo strip, right in the browser. Peer-to-peer video via PeerJS (free
signaling broker) — no backend required.

## Setup

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

This outputs static files to `dist/`, ready to deploy.

## Important: HTTPS required

Browsers block camera/mic access on plain `http://` (except `localhost`). To use this
across two real devices (e.g. your laptop and your girlfriend's phone), deploy it
somewhere with HTTPS — Vercel, Netlify, or GitHub Pages all work great and are free.

### Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Follow the prompts — Vercel auto-detects the Vite config and builds it correctly.

## How to use it

1. One person opens the deployed link and clicks **Start a Booth** — this generates a
   room code and a shareable link.
2. Send the code or link to your partner. They paste the code (or just open the link,
   which auto-fills it) and click **Join Booth**.
3. Once connected, you'll both see live video feeds side by side.
4. Pick a filter, hit **Take Photo**, and after a 3-second countdown it captures both
   feeds into one composite frame.
5. Take up to 4 photos, then **Download Strip** to save a keepsake PNG.

Everything happens client-side — no photos or video are ever uploaded to a server.
