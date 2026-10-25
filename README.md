# Catalogue site

A static personal site: one stylesheet, semantic HTML, and no theme script. Built with [Astro](https://astro.build/) and deployed on Netlify. Fork it, edit one config file, and replace the example entries.

[Cedric Helewaut](https://cedrichelewaut.be) uses this repository for his own site. His entries are still in the content folders. `npm run reset-template` replaces them with examples. That command is not run for you.

The design is a light catalogue. Type is [Aileron](https://github.com/font-archive/Aileron) (CC0, `public/fonts/AILERON-CC0.txt`) with Helvetica, Arial, sans-serif as fallback. Metadata and navigation use [IBM Plex Mono](https://github.com/IBM/plex) (SIL Open Font License, `public/fonts/IBM-PLEX-MONO-OFL.txt`).

MIT licensed. See [LICENSE](LICENSE).

## Quick start

```bash
git clone https://github.com/cedrichelewaut/personalwebsite.git
cd personalwebsite
npm install
npm run dev
```

`npm run dev` serves the site locally. `npm run build` writes `dist/`. `npm run preview` serves that folder.

### Deploy to Netlify

1. Push the repository to GitHub.
2. In Netlify, add a site from that repository. The build settings are already in `netlify.toml`: command `npm run build`, publish `dist`, Node 22.
3. No environment variables are required for the template.

This repository’s `netlify.toml` sets `PERSONAL_BOOKSHELF=true` so Cedric’s production build keeps the bookshelf. **Cloners: delete that line.** The template default is off. Cedric does not need to change anything in the Netlify dashboard.

## Config

Everything that names the owner lives in `src/site.config.ts`.

| Field | Purpose |
| --- | --- |
| `name` | Site name, home heading, and the footer |
| `tagline` | Default meta description and the RSS description |
| `url` | Canonical site URL |
| `email` | Footer and the email social link |
| `location` | Small place name on interior pages |
| `intro` | Highlighted home introduction |
| `contactLink` | Label and href of the link inside the introduction |
| `portrait` | Home portrait (`src`, `alt`, `width`, `height`) |
| `socials` | Contact-page links |
| `formspree` | Contact form endpoint |
| `ogImage` | Open Graph image path |
| `sections` | On/off flags for each part of the site |

`sections` accepts:

| Flag | Default here | What it controls |
| --- | --- | --- |
| `intro` | on | Home portrait and introduction |
| `work` | on | `/work/` |
| `study` | on | `/study/` |
| `projects` | on | `/projects/` |
| `photos` | on | `/photographs/` |
| `blog` | off | `/blog/` |
| `contact` | on | `/contact/` and the intro contact link |
| `running` | on | `/running/` |
| `bookshelf` | off | `/reading/` and the home reading block |

The header is four links, in this order: Home, Experience, Personal Projects, Contact. They sit in a row on wide screens and stack on narrow ones. Contact stays with the others, on the left.

Experience opens `/experience/`, which lists Work and Study when those sections are on. Personal Projects opens `/personal-projects/`, which lists Projects, Photographs, Reading, Running, and Blog for the sections that are on. Turning a section off removes it from that landing page and from the home index. `/work/`, `/study/`, `/projects/`, `/photographs/`, `/reading/`, `/running/`, and `/blog/` stay as they are. If every section in a group is off, that header link is omitted too.

`bookshelf` stays off unless the environment variable `PERSONAL_BOOKSHELF` is `true` at build time. `SECTIONS_ON` and `SECTIONS_OFF` are comma-separated flag names for local checks (`SECTIONS_OFF=work,photos`). `node scripts/check-sections.mjs` builds every on/off combination.

## Turn sections on or off

Set the flag in `src/site.config.ts` and rebuild.

```ts
sections: {
  intro: true,
  work: true,
  study: false,
  projects: true,
  photos: true,
  blog: true,
  contact: true,
  running: false,
  bookshelf: false,
}
```

With `study` off, Study leaves `/experience/` and the home index, and `/study/` is not generated. With `running` off, Running leaves `/personal-projects/` and the home index, and `/running/` is not generated.

## Add a work entry

Add `src/content/work/short-name.md`. The filename is the URL: `short-name.md` is `/work/short-name/`. A lower `order` sits higher.

```yaml
---
title: "Title of the note"
org: "Organisation"
start: "Sept. 2025"
end: "Present"
summary: "One line, used when the page has no body."
order: 1
noteDate: 2026-01-13   # optional, used for RSS
draft: false
---

Write the note in Markdown. With no body, the detail page shows the summary.
```

`start` and `end` may be `Month YYYY` or `D Month YYYY`. The detail page prints them as `sep 25 > present`. An optional `image` is one picture. `photos` is a list of `{ src, alt }`. Nothing is drawn while `photos` is empty.

## Add a study entry

Add `src/content/study/short-name.md`. The fields match a work entry: `title`, `org`, `start`, `end`, `summary`, `order`. `image` and `photos` are optional.

## Add a project

Add `src/content/projects/field-notes.md`. That is `/projects/field-notes/`.

```yaml
---
title: "Project title"
year: "12 may 26 > 30 jul 26"
summary: "One line for the index."
url: ""                   # optional; leave "" for no link
order: 10
draft: false
---

An optional longer note.
```

An empty `url` is not a link.

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
  "note": ""
}
```

`slug` is `/photographs/ghent/`. The caption is `Fig. 01 — Ghent, 06.2022`. Leave `date` as `""` when the month is unknown. `width` and `height` are the file’s pixel size.

## Add a blog post

Turn `blog` on in `src/site.config.ts`. Add `src/content/blog/field-notes.md`. That is `/blog/field-notes/`.

```yaml
---
title: "Post title"
summary: "One line for the index."
noteDate: 2026-01-13
order: 1
draft: false
---

The post.
```

`src/content/blog/example.md` stays a draft and is not published. Old `/notes/` and `/writing/` URLs still redirect home. That redirect is in `netlify.toml`.

## Theme

Colours are custom properties on `:root` in `src/styles/site.css`. Change them there. Type, rules, and the highlighted introduction follow the variables.

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#FAFAF7` | Page background |
| `--ink` | `#151515` | Text and content rules |
| `--grey` | `#5E5B55` | Metadata |
| `--signal` | `#9A2400` | Red earth. The introduction and the thick rules |
| `--link` | `#8C4A3A` | Link text at rest, no underline. Hover and focus (`--link-hover`) are `#9A2400` with a thin underline |
| `--rule` | `#CFCDC6` | Thin decorative column line |

The site stays light. `:root` sets `color-scheme: light` and the page background stays `#FAFAF7`. It does not follow the system colour scheme. The browser theme colour in `src/layouts/Base.astro` is `#fafaf7`, the same paper. There is no theme toggle.

A dark theme is a manual edit. Add this block to `src/styles/site.css` if you want one. It is not in the stylesheet. On the dark paper, `#9A2400` is too dim for a link (about 2.3:1), so the block uses `#E67A5F` at rest and `#E26A45` on hover.

```css
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --paper: #151515;
    --ink: #fafaf7;
    --grey: #a39e96;
    --signal: #e26a45;
    --rule: #3a3834;
    --link: #e67a5f;
    --link-hover: #e26a45;
  }
}
```

`@media (forced-colors: active)` maps those variables, including the link tokens, to the operating system’s high-contrast colours. That is separate from a dark theme.

Headings use Aileron. Navigation, captions, and metadata use IBM Plex Mono. The files are in `public/fonts/`.

## Bookshelf (personal add-on)

The bookshelf is personal to Cedric. It lives in `src/personal/bookshelf/`. The folder README starts with “Personal to Cedric — delete or keep disabled”.

- Default: `bookshelf: false` in `src/site.config.ts`. The home page does not render the reading block, and `/reading/` is not built.
- This repo: `netlify.toml` sets `PERSONAL_BOOKSHELF=true` under `[build.environment]`. Netlify injects that variable when it runs `npm run build`. Cedric’s live site keeps Reading, the currently-reading book, and Latest recommendations without a dashboard change.
- Cloners delete the `PERSONAL_BOOKSHELF` line. To preview Cedric’s bookshelf locally, run `PERSONAL_BOOKSHELF=true npm run dev`.

To keep the add-on and add a book, copy `src/personal/bookshelf/content/reading/example.md` and edit `src/personal/bookshelf/content/current.md`. Books rated 3 or higher are listed, newest first. Home “Latest recommendations” is the three newest with a rating above 4. Do not link a Goodreads profile.

## Reset the content

```bash
npm run reset-template
```

This replaces work, study, project, photograph, portrait, and book entries with one or two files marked “Example — replace this”. It turns the blog flag on, leaves the bookshelf off, and removes the `PERSONAL_BOOKSHELF` line from `netlify.toml`. Run it on a clone, not against the published content, unless that replacement is what you want.

## Collections

A single role, project, photograph, or book does not get a catalogue code. Its filename is the URL.

A catalogue code is only for a finished collection. Copy `src/content/collections/example-series.md`. The code looks like `F_02` or `W_014` and is a quiet mark. The URL stays the readable slug. `example-series.md` is not published.

## Feed

Entries with a body and a `noteDate` are included in `/rss.xml` when their section is on. `/feed.xml` redirects there.
