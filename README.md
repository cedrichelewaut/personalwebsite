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
| `photos` | on | Photography albums on the home page (`/#photography`) and each `/photography/…/` album |
| `contact` | on | Contact form on the home page (`/#contact`) and the intro contact link |
| `running` | on | Running chart and a link to the full schedule on the home page |
| `bookshelf` | off | Home reading block and the full list at `/reading/` |
| `blog` | off | Blog list on the home page (`/#blog`) and each `/blog/…/` post |

The site has two levels. The home page is the only overview. Detail pages are the role, study, and project notes, photo albums, blog posts, book notes, the bookshelf, and the marathon page.

The header is four links, in this order: Home, Experience, Personal Projects, Contact. They sit in a row on wide screens and stack on narrow ones. Contact stays with the others, on the left. Home is `/`. Experience is `/#experience`. Personal Projects is `/#personal-projects`. Contact is `/#contact`.

The home page has no menu. Experience groups Work and Education (Study); Projects, Photography, Readings, Running, Blog and Contact each get their own block when on. Photography is a carousel of the four newest albums with arrows for older ones, and each album page is a title, a short note and a collage. Photography appears when `photos` is on and at least one album is published. The home page lists every published album, so there is no `/photography/` index. Turning a section off removes that block from the home page and does not generate its detail pages. `/reading/` stays as its own page. Every inner page opens with a “Back to home” link and has no menu. `/privacy/` is the privacy notice linked from the footer.

Old overview URLs redirect to the matching home anchor. `/experience/` goes to `/#experience`, `/personal-projects/` to `/#personal-projects`, `/contact/` to `/#contact`, `/work/` to `/#work`, `/study/` to `/#study`, and `/projects/` to `/#projects`. Each rule is also listed without the trailing slash. `/about` and `/about.html` go to `/#work` in one hop, and `/contact.html` goes to `/#contact`. Role, study, and project URLs such as `/work/pxg/` are unchanged. `/blog` and `/blog/` go to `/#blog`. A published post stays at `/blog/…/`. `/photographs` and `/photographs/…/` go to `/#photography`. `/photography` and `/photography/` go there too, because the album list lives on the home page. Those rules use `force`. The rules are in `netlify.toml`.

`bookshelf` stays off unless the environment variable `PERSONAL_BOOKSHELF` is `true` at build time. `SECTIONS_ON` and `SECTIONS_OFF` are comma-separated flag names for local checks (`SECTIONS_OFF=work,running`). `node scripts/check-sections.mjs` builds every on/off combination.

## Turn sections on or off

Set the flag in `src/site.config.ts` and rebuild.

```ts
sections: {
  intro: true,
  work: true,
  study: false,
  projects: true,
  photos: true,
  contact: true,
  running: false,
  bookshelf: false,
  blog: false,
}
```

With `study` off, Study leaves the home page and `/study/…/` articles are not generated. With `running` off, Running leaves the home page. With `photos` off, Photography leaves the home page and `/photography/…/` albums are not generated.

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

## Add a photo album

1. Create a folder `src/content/photography/mexico/`. The folder name is the URL: this one is `/photography/mexico/`.
2. Add `index.md` in that folder.
3. Drop the photographs into the same folder, for example `01.jpg`, `02.jpg`, and `10.jpg`. Every image is picked up automatically and sorted by filename, so `2.jpg` comes before `10.jpg`.
4. Leave `photos: true` in `src/site.config.ts`.
5. Commit and push. Netlify builds the site and publishes the album.

```yaml
---
title: "Mexico"
date: 2026-04-02          # YYYY-MM-DD. Newest albums are listed first
cover: ./cover.jpg        # optional. Without it, the first image is the thumbnail
draft: false              # true hides the album from the build
---

An optional note. It is shown above the photographs.
```

The home Photography section lists every published album, newest first. Each entry is one thumbnail and the title, and the thumbnail links to the album. The thumbnail is `cover` when that field is set, and the first image in the folder otherwise. The album page shows the note and every photograph in the folder. Images are optimised with `astro:assets` and load lazily. There is no separate `/photography/` index, because the home section already lists every album.

`src/content/photography/example/` is a draft with no images. It is not published. Copy that folder to start a new album.

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

This replaces work, study, project, blog, photography, portrait, and book entries with one or two files marked “Example — replace this”. It turns the blog flag on, leaves the bookshelf off, and removes the `PERSONAL_BOOKSHELF` line from `netlify.toml`. Run it on a clone, not against the published content, unless that replacement is what you want.

## Collections

A single role, project, or book does not get a catalogue code. Its filename is the URL. An album’s folder name is the URL.

A catalogue code is only for a finished collection. Copy `src/content/collections/example-series.md`. The code looks like `F_02` or `W_014` and is a quiet mark. The URL stays the readable slug. `example-series.md` is not published.

## Feed

Entries with a body and a `noteDate` are included in `/rss.xml` when their section is on. Published albums are included when `photos` is on. `/feed.xml` redirects there.

## Locked pages

A project with `locked: true` in its front matter is a password-protected article. The repository holds only encrypted data: `src/private/<slug>.json` (the layout plus every text block, AES-256-GCM with a PBKDF2 key) and `public/private/<slug>/*.bin` (the pictures). Visitors see the article laid out as usual, with ciphertext in place of the text and a shuffled mosaic of each picture's tile colours in place of the photos. The right key decrypts everything in the browser: the text resolves letter by letter, the tiles slide into place, and the photo fades in.

To create or update one, keep the readable HTML and the photos outside git (`private-src/` is ignored) and run:

```bash
PAGE_PASSWORD='a long random passphrase' node scripts/encrypt-page.mjs private-src/page.html <slug>
```

The page is an HTML fragment in blocks separated by blank lines (headings, paragraphs, lists, and rows of pictures in `<div class="plates">` with `<figure><img src="photo.jpg" alt="…"><figcaption>…</figcaption></figure>`). The mosaic shows each picture's colours but not its content; fewer columns (`COLS` in the script) leak less. The password must be at least 16 characters unless `ALLOW_WEAK_PASSWORD=1`, because the encrypted files are public and can be guessed against offline. Locked pages are marked `noindex` and left out of the sitemap and RSS.
