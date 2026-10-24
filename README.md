# Cedric Helewaut

Personal site. A static catalogue built with [Astro](https://astro.build/) and deployed on Netlify.

The previous Jekyll theme (Start Bootstrap Clean Blog, Bootstrap) has been removed. Pages are small: semantic HTML, one stylesheet inlined in the head, and no theme script. The site is light only. Colours stay in custom properties so a dark theme can be added later by overriding those variables.

Type: [Aileron](https://github.com/font-archive/Aileron) (CC0, `public/fonts/AILERON-CC0.txt`) with fallback Helvetica, Arial, sans-serif. Metadata is [IBM Plex Mono](https://github.com/IBM/plex) (SIL Open Font License, `public/fonts/IBM-PLEX-MONO-OFL.txt`).

Colours are custom properties in `src/styles/site.css`. The page background is `--paper` (`#FAFAF7`). Ink is `#151515`, grey is `#5E5B55`, signal is `#B4141A`. Thin decorative column lines use `--rule` (`#CFCDC6`). Change the background there; type, content rules, and the browser theme colour follow the variables.

## Develop

```bash
npm install
npm run dev
npm run build
```

`npm run build` writes the site to `dist/`. Netlify runs that command and publishes `dist`.

A single book, project, photograph, or role does not get a catalogue code. Its filename is a readable slug: `field-notes.md` is `/projects/field-notes/`.

A catalogue code is only for a finished collection, such as a photo series, an essay series, or a CV. The code is a short prefix, an underscore, and a number (`F_02`, `CV_01`, `W_014`). It is a quiet mark on the collection. The URL stays the readable slug.

Where a section has no real entries yet, the index shows a row titled `[Placeholder]`. That row is an empty slot, not a work. Reading lists the books he recommends most, so it has no placeholder row.

## Currently reading

Edit `src/content/current.md`. That one file is the book at the top of Reading and in the home-page reading excerpt. Replace the fields to swap it. Do not add a second file.

```yaml
---
title: "De eeuwigheid in een kort moment"
author: "Elif Shafak"
edition: "Dutch edition, Wereldbibliotheek, 2026"
url: "https://www.goodreads.com/book/show/257232432-de-eeuwigheid-in-een-kort-moment"
---
```

## Add a book

Copy `src/content/reading/example.md`. Set `draft` to `false` and replace the fields. `example.md` stays a draft and is not published. The Reading page lists recommendations, not reviews. It does not show a score.

```yaml
---
title: "The book title"
author: "Author name"
read: "2026-05-12"   # YYYY-MM-DD, YYYY-MM, or ""
draft: false
---
```

Name the file `the-book.md`, not a code. `read` is when he finished it. Leave it empty when that date was not recorded. The list prints `12 may 26` or, for a month without a day, `may 26`. Newest dates come first. Undated books come last. A body is optional. With no body, the title stays in the list and does not get its own page.

## Add a project

Copy `src/content/projects/example.md`. These are hobby projects. Paid and academic work belongs under Work.

```yaml
---
title: "Project title"
year: "12 may 26 > 30 jul 26"
summary: "One line for the index."
url: "https://example.com"   # optional
order: 10
draft: false
---

An optional longer note.
```

Name the file `field-notes.md`. That is the permalink `/projects/field-notes/`.

## Add a photograph

Put the image in `public/img/` and add an object to `src/data/photographs.json`:

```json
{
  "slug": "ghent",
  "title": "Ghent",
  "src": "/img/example.jpg",
  "place": "Ghent",
  "date": "06.2022",
  "width": 2000,
  "height": 1200,
  "alt": "What is in the frame.",
  "note": "Short catalogue note. Leave empty if there is nothing to add."
}
```

`slug` is the permalink (`/photographs/ghent/`) and the index anchor. Use lowercase words. The caption is built as `Fig. 01 — Ghent, 06.2022`. Leave `date` as `""` when the month is unknown; the caption then omits it. Do not guess a place or a date. `width` and `height` are the file’s pixel size.

Company logos and `public/img/companies/pxs.jpg` stay in the repo and are not part of the catalogue.

## Add a collection

Copy `src/content/collections/example-series.md` for a finished body of work. `example-series.md` is not published.

```yaml
---
title: "Field notes"
summary: "One line for the index."
code: "W_02"
section: projects   # work, projects, photographs, or reading
order: 10
draft: false
---

The series note. The code is shown in grey beside the title. It is not the URL.
```

Name the file `field-notes.md`. The page is `/projects/field-notes/`. For a photograph series, set `section` to `photographs` and add `photos` as a list of slugs already in `photographs.json`. Do not give that code to the individual plates.

## Add a role

Add `src/content/work/short-name.md`. A role is not a catalogue code. The filename is the permalink: `pxg.md` is `/work/pxg/`. A CV, when it is a finished collection rather than one role, uses the collection file above with `section: work`.

```yaml
---
title: "Title of the longer note"
indexTitle: "Shorter name used in the index"
subtitle: "Optional second line"
org: "Organisation"
start: "Sept. 2025"
end: "Present"
summary: "One line for the index."
order: 1
noteDate: 2026-01-13   # optional, used for RSS
draft: false
---

Write the note in Markdown. With no body, the row stays in the index and does not get its own page.
```

`start` and `end` may be `Month YYYY` or `D Month YYYY`. The index prints them as `sep 25 > present` or `12 may 26 > 30 jul 26`. Days are not invented. `order` runs top to bottom. `noteDate` is `YYYY-MM-DD`.

## Feed

Notes that have a body and a `noteDate` are included in `/rss.xml`. `/feed.xml` redirects there.
