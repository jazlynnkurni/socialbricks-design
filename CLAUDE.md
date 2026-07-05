# Working rules for this repo

1. In JSX text, use `&apos;` instead of raw apostrophes.
2. No em dashes anywhere: not in code, comments, docs, or commit messages.
3. Atomic changes only. One logical change per edit; do not bundle unrelated
   edits together.
4. Grep-verify after edits: after changing code, grep for the changed symbol
   or pattern to confirm the edit landed everywhere it should and nowhere it
   should not.
5. No commits without explicit approval from me. Never push.

## Repo facts

- Design and animation prototype workspace only. No backend, no env vars.
- All mock data lives in `src/lib/mock/`, typed, nowhere else.
- One folder per prototype in `src/components/prototypes/`; register each in
  `src/lib/prototypes.ts`.
- Design tokens are placeholders in `src/styles/tokens.css` until the
  socialbricks-ui package exists.
- This Next.js version may be newer than your training data. Check
  `node_modules/next/dist/docs/` before using APIs you are unsure about.
