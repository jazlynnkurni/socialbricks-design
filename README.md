# socialbricks-design

Frontend design and animation prototype workspace for SocialBricks, the
paperwork-filing platform for social workers. This repo belongs to the
founding designer and contains design-engineering work only: interaction
prototypes, motion studies, and design system primitives. There is no real
backend here; everything runs on typed mock data.

## Stack

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS v4
- Framer Motion
- three.js via @react-three/fiber and @react-three/drei
- GLSL shaders (.glsl/.vert/.frag import as raw strings, see next.config.ts)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The index page lists every prototype; each one
lives at /prototypes/[slug].

## Folder map

```
src/
  app/                       Routes
    page.tsx                 Index, lists all prototypes
    prototypes/[slug]/       One route per prototype
  components/
    ui/                      Design system primitives (Button, Input, Card)
    prototypes/              One folder per prototype (see its README)
  lib/
    prototypes.ts            Prototype registry, drives index + routes
    mock/                    ALL mock data, typed. Nothing is fetched.
  styles/
    tokens.css               Placeholder design tokens (CSS variables)
  shaders/                   GLSL files
  types/
    shaders.d.ts             Module declarations for shader imports
```

## For the backend engineer

This repo is intentionally separate from the product monorepo. To review the
design work, fork or clone it and run the two commands above; no env vars, no
services, no database. Everything worth reviewing is under `src/`:

- Prototypes and their motion work: `src/components/prototypes/`
- The routes that host them: `src/app/prototypes/[slug]/`
- The data shapes the designs assume: `src/lib/mock/`
- Design tokens (placeholder values for now, a shared socialbricks-ui
  package will replace them later): `src/styles/tokens.css`

Nothing in here is meant to be merged into the monorepo as-is; treat it as a
living design reference.
