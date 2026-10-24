# Personal to Cedric — delete or keep disabled

This folder is Cedric Helewaut’s bookshelf. It is not part of the starter template.

The template default in `src/site.config.ts` is `bookshelf: false`. This repository’s `netlify.toml` sets `PERSONAL_BOOKSHELF=true` so Cedric’s production build turns the section on. Cloners should delete that line.

## What lives here

- `content/reading/` — one Markdown file per finished book
- `content/current.md` — the single book in progress
- `pages/` — the `/reading/` bookshelf and a page for any book that has a note
- `components/` — the shelf, the home “Latest recommendations” posters, and the currently-reading block
- `BookshelfExcerpt.astro` — the home-page reading block
- `current.ts` — loads `content/current.md`

There is no Goodreads sync script. Books are Markdown. Do not link a Goodreads profile.

## Turn it off

Leave `bookshelf: false` and do not set `PERSONAL_BOOKSHELF`. The home page renders without the reading block, and `/reading/` is not generated.

You can also delete this whole folder. If you do, remove the `reading` and `current` collections from `src/content.config.ts` as well.

## Add a book

Copy `content/reading/example.md`. The filename is the slug.

```yaml
---
title: "The book title"
author: "Author name"
read: "2026-05-12"   # YYYY-MM-DD, YYYY-MM, or ""
rating: 4.5          # optional. Home recommends rating above 4.
lang: nl             # Dutch only. Omit for English.
draft: false
---
```

The bookshelf lists books rated 3 or higher, newest `read` date first. Leave `read` empty when that date was not recorded. Undated books come last. A body is optional. With no body, the title stays in the list and does not get its own page.

Edit `content/current.md` to change the book in progress. Keep it as the only file with that name.
