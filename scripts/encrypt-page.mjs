/**
 * Encrypt the body of a locked project.
 * Usage: PAGE_PASSWORD='long random passphrase' node scripts/encrypt-page.mjs <page.html> <slug>
 *
 * The page is an HTML fragment in the site's own prose markup, in blocks separated by blank lines.
 * A block is a heading, paragraph or list, or a row of pictures:
 *
 *   <div class="plates">
 *   <figure><img src="photo.jpg" alt="…"><figcaption>…</figcaption></figure>
 *   </div>
 *
 * Every block is encrypted on its own with AES-256-GCM (key from the password with PBKDF2-SHA256).
 * The public file src/private/<slug>.json keeps only the layout: block types and lengths, picture sizes,
 * and a shuffled mosaic of each picture's tile colours. The shuffle order, the picture and its caption are
 * encrypted. Pictures are written to public/private/<slug>/<n>.bin.
 * The project needs src/content/projects/<slug>.md with `locked: true`.
 * Keep the readable page and the photos outside git (private-src/ is ignored).
 */
import { createCipheriv, pbkdf2Sync, randomBytes, randomInt } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

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

const ITER = 600000;
const COLS = 16; // mosaic columns. Fewer is blurrier and leaks less of the picture.
const MAX_WIDTH = 1400;
const salt = randomBytes(16);
const key = pbkdf2Sync(password, salt, ITER, 32, "sha256");

function seal(buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(buffer), cipher.final(), cipher.getAuthTag()]);
  return { iv: iv.toString("base64"), data: body.toString("base64"), size: body.length };
}

function shuffled(count) {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const dir = path.dirname(path.resolve(input));
const outDir = path.join("public", "private", slug);
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

let pictures = 0;
async function picture(src, alt, caption) {
  const original = readFileSync(path.join(dir, src));
  const jpeg = await sharp(original)
    .flatten({ background: "#ffffff" })
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 84 })
    .toBuffer();
  const { width, height } = await sharp(jpeg).metadata();
  const rows = Math.max(4, Math.round((COLS * height) / width));
  const raw = await sharp(jpeg).resize(COLS, rows, { fit: "fill" }).removeAlpha().raw().toBuffer();
  const order = shuffled(COLS * rows); // shuffled position -> true tile
  const tiles = order.map((tile) => raw.subarray(tile * 3, tile * 3 + 3).toString("hex")).join("");
  const header = Buffer.from(JSON.stringify(order));
  const length = Buffer.alloc(4);
  length.writeUInt32BE(header.length);
  const file = `${pictures}.bin`;
  const sealed = seal(Buffer.concat([length, header, jpeg]));
  writeFileSync(path.join(outDir, file), Buffer.concat([Buffer.from(sealed.iv, "base64"), Buffer.from(sealed.data, "base64")]));
  pictures += 1;
  const text = seal(Buffer.from(JSON.stringify({ alt, caption })));
  return {
    w: width,
    h: height,
    cols: COLS,
    rows,
    tiles,
    file: `/private/${slug}/${file}`,
    capLen: caption.length,
    civ: text.iv,
    cdata: text.data,
  };
}

const plain = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const blocks = [];
for (const block of readFileSync(input, "utf8").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)) {
  if (block.startsWith('<div class="plates">')) {
    const items = [];
    for (const match of block.matchAll(/<figure>\s*<img\b([^>]*)>\s*(?:<figcaption>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/g)) {
      const src = /src="([^"]+)"/.exec(match[1])?.[1];
      const alt = /alt="([^"]*)"/.exec(match[1])?.[1] ?? "";
      if (!src) throw new Error("A picture has no src.");
      items.push(await picture(src, alt, match[2]?.trim() ?? ""));
    }
    blocks.push({ k: "g", items });
  } else {
    const tag = /^<(\w+)/.exec(block)?.[1] ?? "p";
    blocks.push({ k: "t", tag, len: plain(block).length, ...(({ iv, data }) => ({ iv, data }))(seal(Buffer.from(block))) });
  }
}

mkdirSync("src/private", { recursive: true });
const out = `src/private/${slug}.json`;
writeFileSync(out, JSON.stringify({ v: 2, iter: ITER, salt: salt.toString("base64"), blocks }) + "\n");
console.log(`Wrote ${out}: ${blocks.length} blocks, ${pictures} pictures in ${outDir}`);
