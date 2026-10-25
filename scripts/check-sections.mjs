/**
 * Build every on/off combination of the optional sections.
 * Usage: node scripts/check-sections.mjs
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const keys = ["intro", "work", "study", "projects", "photos", "blog", "contact", "running", "bookshelf"];
const defaults = {
  intro: true,
  work: true,
  study: true,
  projects: true,
  photos: true,
  blog: false,
  contact: true,
  running: true,
  bookshelf: false,
};

const pages = {
  work: "work/index.html",
  study: "study/index.html",
  projects: "projects/index.html",
  photos: "photographs/index.html",
  blog: "blog/index.html",
  contact: "contact/index.html",
  running: "running/index.html",
  bookshelf: "reading/index.html",
};

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
    for (const [key, rel] of Object.entries(pages)) {
      const present = existsSync(path.join(outDir, rel));
      if (state[key] && !present) missing.push(rel);
      if (!state[key] && present) unexpected.push(rel);
    }
    if (!existsSync(path.join(outDir, "index.html"))) missing.push("index.html");
    const experience = state.work || state.study;
    const personal = state.projects || state.photos || state.bookshelf || state.running || state.blog;
    const experiencePage = existsSync(path.join(outDir, "experience/index.html"));
    const personalPage = existsSync(path.join(outDir, "personal-projects/index.html"));
    if (experience && !experiencePage) missing.push("experience/index.html");
    if (!experience && experiencePage) unexpected.push("experience/index.html");
    if (personal && !personalPage) missing.push("personal-projects/index.html");
    if (!personal && personalPage) unexpected.push("personal-projects/index.html");
    if (missing.length || unexpected.length) {
      failed += 1;
      console.error(`FAIL routes ${label} missing=${missing.join(",")} unexpected=${unexpected.join(",")}`);
    } else if (done % 32 === 0 || done === 512) {
      console.log(`${done}/512`);
    }
  }
}

const started = Date.now();
await Promise.all(Array.from({ length: workers }, (_, id) => runWorker(id + 1)));
console.log(`finished ${done} failed ${failed} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
process.exit(failed === 0 ? 0 : 1);
