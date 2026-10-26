/**
 * Encrypt an HTML fragment (the article body, in the site's own prose markup) for a locked project.
 * Usage: PAGE_PASSWORD='long random passphrase' node scripts/encrypt-page.mjs <page.html> <slug>
 *
 * Keep the plaintext page outside git (private-src/ is ignored). The output,
 * src/private/<slug>.json, is safe to commit: AES-256-GCM, key from the
 * password with PBKDF2-SHA256. Local images (<img src="photo.jpg">) are inlined first.
 * The project needs src/content/projects/<slug>.md with `locked: true`.
 */
import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const [input, slug] = process.argv.slice(2);
const password = process.env.PAGE_PASSWORD ?? "";
if (!input || !slug) {
  console.error("Usage: PAGE_PASSWORD=... node scripts/encrypt-page.mjs <page.html> <slug>");
  process.exit(1);
}
if (password.length < 16) {
  if (process.env.ALLOW_WEAK_PASSWORD !== "1") {
    console.error("PAGE_PASSWORD must be at least 16 characters. Anyone can try guesses offline.");
    console.error("Set ALLOW_WEAK_PASSWORD=1 to accept a short one anyway.");
    process.exit(1);
  }
  console.warn("Warning: a short password can be guessed offline from the public encrypted file.");
}

const types = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml" };
const dir = path.dirname(path.resolve(input));
const html = readFileSync(input, "utf8").replace(/(<img\b[^>]*?\bsrc=")([^"]+)(")/gi, (whole, a, src, b) => {
  if (/^(data:|https?:|\/\/)/i.test(src)) return whole;
  const type = types[path.extname(src).slice(1).toLowerCase()];
  if (!type) return whole;
  return `${a}data:${type};base64,${readFileSync(path.join(dir, src)).toString("base64")}${b}`;
});

const iter = 600000;
const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(password, salt, iter, 32, "sha256");
const cipher = createCipheriv("aes-256-gcm", key, iv);
const body = Buffer.concat([cipher.update(gzipSync(Buffer.from(html, "utf8"))), cipher.final(), cipher.getAuthTag()]);

mkdirSync("src/private", { recursive: true });
const out = `src/private/${slug}.json`;
writeFileSync(out, JSON.stringify({ v: 1, iter, salt: salt.toString("base64"), iv: iv.toString("base64"), data: body.toString("base64") }) + "\n");
console.log(`Wrote ${out} (${Math.round(body.length / 1024)} KB)`);
