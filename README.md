# Shobhit Chola · Portfolio

Personal portfolio — a cosmic, WebGL-driven single page with a living neural-network hero.

**Live:** [shobhitchola.vercel.app](https://shobhitchola.vercel.app)

## Stack

- React 19 + Vite
- Three.js / React Three Fiber (custom GLSL particle shaders, bloom)
- GSAP + ScrollTrigger, Lenis smooth scroll
- Self-hosted fonts (Unbounded, Space Grotesk, JetBrains Mono, Instrument Serif)

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

## Deploy

Every push to `main` auto-deploys to production via Vercel.
Manual deploy: `npx vercel --prod`.

All site copy lives in `src/content.js`. The resume served at `/resume.pdf`
is `public/resume.pdf` — replace the file and push to update it.
