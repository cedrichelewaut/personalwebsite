/**
 * Build every on/off combination of the optional sections.
 * Usage: node scripts/check-sections.mjs
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const keys = ["intro", "work", "study", "projects", "photos", "contact", "bookshelf", "blog"];
const defaults = {
  intro: true,
  work: true,
  study: true,
  projects: true,
  photos: true,
  contact: true,
  bookshelf: false,
  blog: false,
};

function hasPublishedAlbums() {
  const base = path.resolve("src/content/photography");
  if (!existsSync(base)) return false;
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) {
        if (walk(full)) return true;
        continue;
      }
      if (name !== "index.md") continue;
      const text = readFileSync(full, "utf8");
      if (!/^draft:\s*true\s*$/m.test(text)) return true;
    }
    return false;
  };
  return walk(base);
}

const publishedAlbums = hasPublishedAlbums();
const total = 1 << keys.length;

const level2 = {
  bookshelf: "reading/index.html",
};

const removed = [
  "running/index.html",
  "experience/index.html",
  "personal-projects/index.html",
  "contact/index.html",
  "work/index.html",
  "study/index.html",
  "projects/index.html",
  "blog/index.html",
  "photographs/index.html",
  "photography/index.html",
  "articles/index.html",
];

const overviewHref = /href="\/(experience|personal-projects|contact|work|study|projects|blog|photographs)\/?"/;

function envFor(state) {
  const on = [];
  const off = [];
  for (const key of keys) {
    if (state[key] && !defaults[key]) on.push(key);
    if (!state[key] && defaults[key]) off.push(key);
  }
  if (!state.bookshelf) off.push("bookshelf");
  return {
    ...process.env,
    PERSONAL_BOOKSHELF: state.bookshelf ? "true" : "false",
    SECTIONS_ON: on.join(","),
    SECTIONS_OFF: off.join(","),
  };
}

function build(outDir, env) {
  return new Promise((resolve) => {
    const child = spawn("npx", ["astro", "build", "--outDir", outDir], {
      cwd: process.cwd(),
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("close", (code) => resolve({ code, output }));
  });
}

function states() {
  const all = [];
  const total = 1 << keys.length;
  for (let mask = 0; mask < total; mask += 1) {
    const state = {};
    keys.forEach((key, index) => {
      state[key] = Boolean(mask & (1 << index));
    });
    all.push(state);
  }
  return all;
}

const queue = states();
const workers = Number(process.env.CHECK_WORKERS || 1);
let failed = 0;
let done = 0;

async function runWorker(id) {
  const outDir = path.resolve(`/tmp/section-check-${id}`);
  while (queue.length) {
    const state = queue.shift();
    const label = keys.filter((key) => state[key]).join("+") || "none";
    const result = await build(outDir, envFor(state));
    done += 1;
    if (result.code !== 0) {
      failed += 1;
      console.error(`FAIL build ${label}\n${result.output.slice(-1500)}`);
      continue;
    }
    const missing = [];
    const unexpected = [];
    for (const [key, rel] of Object.entries(level2)) {
      const present = existsSync(path.join(outDir, rel));
      if (state[key] && !present) missing.push(rel);
      if (!state[key] && present) unexpected.push(rel);
    }
    for (const rel of removed) {
      if (existsSync(path.join(outDir, rel))) unexpected.push(rel);
    }
    const homePath = path.join(outDir, "index.html");
    if (!existsSync(homePath)) missing.push("index.html");
    const experience = state.work || state.study;
    if (existsSync(homePath)) {
      const home = readFileSync(homePath, "utf8");
      const anchors = {
        experience,
        contact: state.contact,
        work: state.work,
        study: state.study,
        projects: state.projects,
        photography: state.photos && publishedAlbums,
        reading: state.bookshelf,
        blog: state.blog,
      };
      for (const [id, on] of Object.entries(anchors)) {
        const present = home.includes(`id="${id}"`);
        if (on && !present) missing.push(`#${id}`);
        if (!on && present) unexpected.push(`#${id}`);
      }
      for (const href of ["/#experience", "/#personal-projects"]) {
        if (home.includes(`href="${href}"`)) unexpected.push(href);
      }
      if (home.includes('class="site-nav')) unexpected.push("nav");
    }
    const stale = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const full = path.join(dir, name);
        if (statSync(full).isDirectory()) {
          walk(full);
          continue;
        }
        if (!name.endsWith(".html")) continue;
        const rel = path.relative(outDir, full).split(path.sep).join("/");
        if (rel.startsWith("articles/")) unexpected.push(rel);
        if (!state.photos && rel.startsWith("photography/")) unexpected.push(rel);
        if (!state.blog && rel.startsWith("blog/")) unexpected.push(rel);
        const html = readFileSync(full, "utf8");
        if (overviewHref.test(html)) stale.push(rel);
      }
    };
    if (existsSync(outDir)) walk(outDir);
    if (stale.length) unexpected.push(`overview href in ${stale.join(" ")}`);
    if (missing.length || unexpected.length) {
      failed += 1;
      console.error(`FAIL routes ${label} missing=${missing.join(",")} unexpected=${unexpected.join(",")}`);
    } else if (done % 32 === 0 || done === total) {
      console.log(`${done}/${total}`);
    }
  }
}

const started = Date.now();
await Promise.all(Array.from({ length: workers }, (_, id) => runWorker(id + 1)));
console.log(`finished ${done} failed ${failed} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
process.exit(failed === 0 ? 0 : 1);
