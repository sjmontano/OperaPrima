<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-workflow -->

# Design Workflow — Skill Integration

When working on design/frontend tasks, chain skills in this order:

```
ui-ux-pro-max → google-design-md → tailwind-v4-shadcn → impeccable
                                                           │
                                                           ├── accessibility
                                                           └── seo
```

## Decision Flow

1. **ui-ux-pro-max** — Decide style, palette, typography, UX patterns (use `--domain color`, `--domain typography`, `--design-system`)
2. **google-design-md** — Formalize decisions into `DESIGN.md` (machine-readable tokens + rationale)
3. **tailwind-v4-shadcn** — Export tokens to `@theme` in `globals.css` and `design-tokens.ts`
4. **impeccable** — Build components/pages using `craft` (shape-then-build), reinforce design system with `extract`
5. **accessibility** — WCAG 2.2 audit before delivery
6. **seo** — Meta, structured data, sitemap

## Key Rules

- Always run ui-ux-pro-max first before google-design-md — it provides the design decisions that populate DESIGN.md
- impeccable's `teach` sets design context; ui-ux-pro-max's `--domain` queries provide the data
- After building, run `extract` to pull reusable tokens/components back into the design system

<!-- END:design-workflow -->
