# Prototypes

One folder per prototype. The folder name is the prototype slug and must match
its entry in `src/lib/prototypes.ts`, which drives both the index page and the
`/prototypes/[slug]` route.

```
src/components/prototypes/
  case-queue/          <- slug: case-queue
    CaseQueue.tsx      <- main component, rendered by the [slug] page
    ...                <- any supporting components, hooks, or variants
```

Rules:

- Mock data comes from `src/lib/mock/` only. Never inline data here.
- Shaders live in `src/shaders/` and import as raw strings.
- Shared primitives belong in `src/components/ui/`, not inside a prototype.
