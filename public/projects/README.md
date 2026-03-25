# Project Catalog And Asset Structure

Project onboarding is centralized in one source file:

- `src/data/projectCatalog.json`

Each catalog entry contains both category and full project payload (`details`, `documents`, `gallery`, contract metadata, and all card/detail fields).

## Asset folders

Each project still keeps physical assets under:

- `public/projects/<project-id>/images/`
- `public/projects/<project-id>/files/`
- `public/projects/<project-id>/abi/`

Example:

- `public/projects/HIP-001/images/01-exterior.jpg`
- `public/projects/HIP-001/files/investment-memo.pdf`
- `public/projects/HIP-001/abi/TicketSale.abi.json`

## How to add a project

1. Add one entry in `src/data/projectCatalog.json` with `category` and `project` data.
2. Add media and files into `public/projects/<project-id>/`.
3. Run scaffold to create any missing folders and sync gallery from image/video files:

```bash
npm run scaffold:project-assets
```

Dry run (no writes):

```bash
npm run scaffold:project-assets -- --dry-run
```

## Gallery sync behavior

- Gallery entries are synced into `src/data/projectCatalog.json` from `public/projects/<project-id>/images/`.
- Image/video titles are derived from filenames.
- Supported videos: `.mp4`, `.webm`, `.ogg`, `.mov`, `.m4v`.
- Embedded/external video URLs are not preserved by the sync command.

## ABI convention

- Default ABI filename: `TicketSale.abi.json`
- Location: `public/projects/<project-id>/abi/TicketSale.abi.json`
- Runtime fallback: `src/lib/contracts.ts` shared ABI if project ABI is missing/invalid.
