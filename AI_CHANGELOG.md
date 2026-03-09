# AI Change Log (my-blog)

> Last updated: 2026-02-27  
> Purpose: Provide reliable handoff context for future AI agents.

## Scope Of This Update

This update focused on four areas:

1. Reliability of content loading/frontmatter parsing
2. Lint/tooling stability
3. Bundle-size and code-splitting performance
4. Documentation drift reduction

## What Changed And Why

### 0.2 Safe dead-code cleanup (new)

- Files removed (unreferenced in app/runtime):
  - `src/App.css`
  - `src/assets/react.svg`
  - `src/hello-world.md`
  - `src/components/SocialLink.jsx`
  - `src/components/feed/FeedCard.jsx`
  - `src/lib/loadFeed.js`
  - `src/lib/generateRSS.js`
  - `src/lib/parseFrontmatter.js`
- Directories removed (empty):
  - `src/components/feed/`
  - `src/components/digest/`
- Docs updated:
  - `.github/copilot-instructions.md` adjusted to remove stale references.
- Why:
  - These files were not imported by current routes/components/tooling.
  - Cleanup reduces maintenance noise without affecting primary build/runtime paths.

### 0. Navigation category and post category alignment fix (new)

- Files:
  - `src/lib/categoryMapping.js`
  - `src/lib/loadPosts.js`
  - `src/components/PostListItem.jsx`
  - `src/pages/Post.jsx`
- Change:
  - Added `normalizeToNavCategory(...)` to map raw categories into navigation buckets:
    - `Reading/Essay/Language` -> `Language`
    - `Tech/Engineering` -> `Engineering`
    - `Math/Algorithm` -> `Algorithm`
    - `Physics` -> `Physics`
  - `loadPosts` now stores both:
    - `rawCategory` (original frontmatter category)
    - `category` (normalized nav category used for filtering)
  - List/detail UI shows normalized category, and also shows `rawCategory` badge when different.
- Why:
  - Existing posts used mixed taxonomies (`Math`, `Tech`, `Essay`, `Reading`) while nav filters only used L.E.A.P. categories.
  - This caused filter mismatch and missing results under navigation tabs.

### 0.1 Mobile list date size adjustment (new)

- File: `src/components/PostListItem.jsx`
- Change:
  - Reduced mobile date text size from large display style to a smaller readable style.
  - Desktop date style remains unchanged.
- Why:
  - On mobile list pages, date text looked visually too dominant compared with title/summary.

### 1. `loadPosts` now supports nested markdown paths

- File: `src/lib/loadPosts.js`
- Change:
  - `import.meta.glob('../posts/*.md', ...)` -> `import.meta.glob('../posts/**/*.md', ...)`
  - Slug generation now preserves sub-paths (e.g. `reading/math-language-ch1`)
  - `digest` posts are explicitly excluded from the main blog post list
- Why:
  - The repo already stores posts in nested folders (`src/posts/reading/...`), but old glob only loaded root-level `.md`.
  - Prevent digest content from leaking into normal post feeds.

### 2. Digest frontmatter parsing switched to `front-matter`

- File: `src/lib/loadDigest.js`
- Change:
  - Removed custom `parseYAML` implementation.
  - Unified parsing via `front-matter`.
- Why:
  - Digest files use nested frontmatter (e.g. `stats.totalItems`, `stats.sources`).
  - Manual parser could not reliably parse nested structures.

### 3. Demo module loading changed to lazy loading

- Files:
  - `src/components/customModules.js`
  - `src/components/MarkdownRenderer.jsx`
- Change:
  - `import.meta.glob(..., { eager: true })` -> lazy module imports.
  - Render wrapped with `Suspense` fallback.
- Why:
  - `eager: true` forced all demo code (`three`, `d3`) into startup bundle even when not used.
  - This significantly hurt initial load.

### 4. Route-level lazy loading added

- File: `src/App.jsx`
- Change:
  - `Home`, `PostRoute`, `About`, `Subscribe` are now loaded with `React.lazy`.
  - Routes wrapped in `Suspense`.
- Why:
  - Keep non-home pages out of initial JS payload.

### 5. `Post` page lazily loads markdown renderer

- File: `src/pages/Post.jsx`
- Change:
  - `MarkdownRenderer` moved to lazy import + `Suspense`.
  - Replaced browser-incompatible `process.env.NODE_ENV` with `import.meta.env.DEV`.
- Why:
  - Prevent markdown rendering stack from being bundled into route shell.
  - Fix lint/runtime correctness for Vite ESM environment.

### 6. Vite manual chunk strategy added

- File: `vite.config.js`
- Change:
  - Added `build.rollupOptions.output.manualChunks(...)`.
  - Split large vendor groups: markdown, rendering, lightbox, `three`, `d3`.
- Why:
  - Reduce single oversized chunks and improve cache behavior.

### 7. ESLint setup stabilized

- Files:
  - `package.json`
  - `eslint.config.js`
  - several source files with minor lint fixes
- Change:
  - `lint` script updated to flat-config compatible command.
  - ESLint config rewritten to avoid `eslint/config` import path issue.
  - Added Node globals override for `scripts/**/*` and `*.config.js`.
  - Fixed unused vars / no-undef issues discovered by lint.
- Why:
  - Lint pipeline was effectively broken before this update.
  - A working lint gate is required for safe AI-assisted edits.

## Build/Lint Verification After Changes

- `npm run lint`: pass
- `npm run build`: pass

## Bundle Result Snapshot (After Optimization)

Compared to pre-optimization state:

- Initial entry bundle dropped from ~1.5MB to a much smaller split entry.
- Route and renderer code are now separated.
- Heavy dependencies are grouped into dedicated vendor chunks.
- Previous chunk-size warning over 500KB was addressed after manual chunking.

## Important Notes For Future AI Agents

1. Do not revert lazy-loading of demo components unless there is a measured reason.
2. Keep `loadPosts` recursive glob behavior; nested folders are intentional.
3. Keep digest parsing with `front-matter`; nested frontmatter is required.
4. If running checks via automation, do not execute `lint` and `build` in parallel.
   - Vite can create/remove temporary timestamp files that may cause transient `ENOENT` in ESLint when both run simultaneously.
5. `PROJECT_OVERVIEW.md` and older agent docs may contain stale script references. Prefer current `package.json` + this file.
