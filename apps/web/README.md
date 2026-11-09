# BookRate Web

Next.js App Router application for BookRate.

Run commands from the repository root with Bun:

```powershell
bun run dev --filter=web
bun run build --filter=web
bun run lint --filter=web
bun run typecheck --filter=web
```

The app is a Bun workspace at `apps/web`; shared TypeScript options come from
`@bookrate/config/tsconfig/base.json`.
