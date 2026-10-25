/**
 * Replace Cedric's personal entries with clearly marked examples.
 * Does not run unless you execute `npm run reset-template`.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function write(rel, contents) {
  const file = path.join(root, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, contents);
}

function removeMarkdown(rel) {
  const dir = path.join(root, rel);
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name.endsWith(".md")) unlinkSync(path.join(dir, name));
  }
}

function removePublic(src) {
  if (!src.startsWith("/")) return;
  const file = path.join(root, "public", src);
  if (existsSync(file)) unlinkSync(file);
}

const role = (title, org, order) => `---
title: "${title}"
org: "${org}"
start: "Jan. 2024"
end: "Present"
summary: "Example summary. Replace this entry."
order: ${order}
draft: false
---

Example note. Replace this file.
`;

const project = (title, order) => `---
title: "${title}"
year: "2026"
summary: "Example summary. Replace this entry."
url: ""
order: ${order}
draft: false
---

Example note. Replace this file.
`;

const post = (title, order) => `---
title: "${title}"
summary: "Example summary. Replace this entry."
noteDate: 2026-01-01
order: ${order}
draft: false
---

Example note. Replace this file.
`;

const album = `---
title: "Example album — replace this"
date: 2026-01-01
draft: true
---

Replace this note. Add photographs to this folder. They are picked up automatically.
`;

const book = (title, rating, read) => `---
title: "${title}"
author: "Example author"
read: "${read}"
rating: ${rating}
draft: false
---
`;

const portrait = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200" viewBox="0 0 800 1200">
  <rect width="800" height="1200" fill="#fafaf7"/>
  <rect x="24" y="24" width="752" height="1152" fill="none" stroke="#151515"/>
  <text x="400" y="600" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#151515">Example portrait — replace this</text>
</svg>
`;

removeMarkdown("src/content/work");
removeMarkdown("src/content/study");
removeMarkdown("src/content/projects");
removeMarkdown("src/personal/bookshelf/content/reading");
rmSync(path.join(root, "src/content/articles"), { recursive: true, force: true });
rmSync(path.join(root, "src/content/blog"), { recursive: true, force: true });
rmSync(path.join(root, "src/content/photography"), { recursive: true, force: true });

write("src/content/work/example-role.md", role("Example role — replace this", "Example organisation", 1));
write("src/content/work/example-earlier-role.md", role("Example earlier role — replace this", "Example organisation", 2));
write("src/content/study/example-degree.md", role("Example degree — replace this", "Example university", 1));
write("src/content/study/example-course.md", role("Example course — replace this", "Example university", 2));
write("src/content/projects/example-project.md", project("Example project — replace this", 1));
write("src/content/projects/example-second-project.md", project("Example second project — replace this", 2));
write("src/content/blog/example-post.md", post("Example post — replace this", 1));
write("src/content/blog/example-second-post.md", post("Example second post — replace this", 2));
write("src/content/photography/example/index.md", album);
write("src/personal/bookshelf/content/reading/example-book.md", book("Example book — replace this", 5, "2026-05-12"));
write(
  "src/personal/bookshelf/content/reading/example-second-book.md",
  book("Example second book — replace this", 4, "2026-01-03"),
);
write(
  "src/personal/bookshelf/content/current.md",
  `---
title: "Example book in progress — replace this"
author: "Example author"
edition: "Example edition, 2026"
url: "https://example.com"
---

Replace this file to change the book in progress.
`,
);

write("public/img/example-portrait.svg", portrait);
removePublic("/img/cedric-portrait.jpg");

const configPath = path.join(root, "src/site.config.ts");
let config = readFileSync(configPath, "utf8");
config = config.replace(/ogImage: "\/img\/cedric-portrait\.jpg"/, 'ogImage: "/img/example-portrait.svg"');
config = config.replace(
  /portrait:\s*\{[\s\S]*?\n  \},/,
  `portrait: {
    src: "/img/example-portrait.svg",
    alt: "Example portrait — replace this",
    width: 800,
    height: 1200,
  },`,
);
config = config.replace(/bookshelf:\s*true/, "bookshelf: false");
config = config.replace(/blog:\s*false/, "blog: true");
writeFileSync(configPath, config);

const netlifyPath = path.join(root, "netlify.toml");
if (existsSync(netlifyPath)) {
  const lines = readFileSync(netlifyPath, "utf8")
    .split("\n")
    .filter((line) => !line.includes("PERSONAL_BOOKSHELF"));
  writeFileSync(netlifyPath, lines.join("\n").replace(/\n{3,}/g, "\n\n"));
}

rmSync(path.join(root, "dist"), { recursive: true, force: true });

console.log("Template reset. Personal entries are now examples.");
console.log("Edit src/site.config.ts for the name, intro, and social links.");
console.log("Bookshelf stays off. See src/personal/bookshelf/README.md to turn it on.");
