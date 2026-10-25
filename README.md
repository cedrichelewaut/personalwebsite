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
| `socials` | Links in the contact section on the home page |
| `formspree` | Contact form endpoint |
| `ogImage` | Open Graph image path |
| `sections` | On/off flags for each part of the site |

`sections` accepts:

| Flag | Default here | What it controls |
| --- | --- | --- |
| `intro` | on | Home portrait and introduction |
| `work` | on | Work list on the home page (`/#work`) and each `/work/…/` article |
| `study` | on | Study list on the home page (`/#study`) and each `/study/…/` article |
| `projects` | on | Projects list on the home page (`/#projects`) and each `/projects/…/` article |
| `contact` | on | Contact form on the home page (`/#contact`) and the intro contact link |
| `running` | on | Running note on the home page and the marathon page at `/running/` |
| `bookshelf` | off | Home reading block and the full list at `/reading/` |

The site has two levels. The home page is the only overview. Detail pages are the role, study, and project notes, the articles at `/articles/…/`, book notes, the bookshelf, and the marathon page.

The header is four links, in this order: Home, Experience, Personal Projects, Contact. They sit in a row on wide screens and stack on narrow ones. Contact stays with the others, on the left. Home is `/`. Experience is `/#experience`. Personal Projects is `/#personal-projects`. Contact is `/#contact`.

Experience on the home page lists Work and Study when those sections are on. Personal Projects lists Projects, Reading, and Running for the sections that are on. The home page also shows the three newest articles and links to the full list at `/articles/`. Turning a section off removes that block from the home page and does not generate its detail pages. `/reading/` and `/running/` stay as their own pages. If every section in a group is off, that header link is omitted too.

Old overview URLs redirect to the matching home anchor. `/experience/` goes to `/#experience`, `/personal-projects/` to `/#personal-projects`, `/contact/` to `/#contact`, `/work/` to `/#work`, `/study/` to `/#study`, and `/projects/` to `/#projects`. Each rule is also listed without the trailing slash. `/about` and `/about.html` go to `/#work` in one hop, and `/contact.html` goes to `/#contact`. Role, study, and project URLs such as `/work/pxg/` are unchanged. `/blog/` and `/blog/…/` go to `/articles/`. `/photographs` and `/photographs/…/` go to `/`. Those rules use `force`. The rules are in `netlify.toml`.

`bookshelf` stays off unless the environment variable `PERSONAL_BOOKSHELF` is `true` at build time. `SECTIONS_ON` and `SECTIONS_OFF` are comma-separated flag names for local checks (`SECTIONS_OFF=work,running`). `node scripts/check-sections.mjs` builds every on/off combination.

## Turn sections on or off

Set the flag in `src/site.config.ts` and rebuild.

```ts
sections: {
  intro: true,
  work: true,
  study: false,
  projects: true,
  contact: true,
  running: false,
  bookshelf: false,
}
```

With `study` off, Study leaves the home page and `/study/…/` articles are not generated. With `running` off, Running leaves the home page and `/running/` is not generated.

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

`start` and `end` may be `Month YYYY` or `D Month YYYY`. The detail page prints them as `sep 25 > present`.

## Add a study entry

Add `src/content/study/short-name.md`. The fields match a work entry: `title`, `org`, `start`, `end`, `summary`, `order`.

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

## Add an article

1. Create a folder `src/content/articles/short-name/`.
2. Add `index.md` in that folder, and drop any images next to it.
3. Commit and push. Netlify builds the site and publishes `/articles/short-name/`.

```yaml
---
title: "Article title"
date: 2026-01-13
summary: "One line for the list."   # optional
cover: ./cover.jpg                   # optional
draft: false                         # true hides the article from the build
---

The article. Refer to an image in this folder as `./photo.jpg`.
```

The folder name is the URL. `date` is `YYYY-MM-DD`. The home page shows the three newest articles, with a cover and a title, and links to every article at `/articles/`. If `cover` is omitted, the first image in the folder is the cover. Images are optimised with `astro:assets`. `src/content/articles/example/` is a draft and is not published. Old `/notes/` and `/writing/` URLs still redirect. That redirect is in `netlify.toml`.

## Theme

Colours are custom properties on `:root` in `src/styles/site.css`. Change them there. Type, rules, and the highlighted introduction follow the variables.

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#FAFAF7` | Page background |
| `--ink` | `#151515` | Text and content rules |
| `--grey` | `#5E5B55` | Metadata |
| `--signal` | `#9A2400` | Red earth. The introduction and the thick rules |
| `--link` | `#151515` | Link text. No underline at rest. Hover and focus stay ink and add a 1px underline |
| `--rule` | `#CFCDC6` | Thin decorative column line |

The site stays light. `:root` sets `color-scheme: light` and the page background stays `#FAFAF7`. It does not follow the system colour scheme. The browser theme colour in `src/layouts/Base.astro` is `#fafaf7`, the same paper. There is no theme toggle.

A dark theme is a manual edit. Add this block to `src/styles/site.css` if you want one. It is not in the stylesheet. Resting links and their hover follow the light ink. The underline is the only change.

```css
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --paper: #151515;
    --ink: #fafaf7;
    --grey: #a39e96;
    --signal: #e26a45;
    --rule: #3a3834;
    --link: #fafaf7;
    --link-hover: #fafaf7;
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

A single role, project, or book does not get a catalogue code. Its filename is the URL. An article’s folder name is the URL.

A catalogue code is only for a finished collection. Copy `src/content/collections/example-series.md`. The code looks like `F_02` or `W_014` and is a quiet mark. The URL stays the readable slug. `example-series.md` is not published.

## Feed

Entries with a body and a `noteDate` are included in `/rss.xml` when their section is on. `/feed.xml` redirects there.
