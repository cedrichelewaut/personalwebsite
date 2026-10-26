/**
 * Recover the readable source of a locked project, so it can be edited and encrypted again.
 * Usage: PAGE_PASSWORD='the key' node scripts/decrypt-page.mjs <slug> <out.html>
 *
 * Reads src/private/<slug>.json and public/private/<slug>/*.bin, and writes the HTML fragment to <out.html>
 * with the pictures next to it as JPEG files (named after the original files where the page recorded them).
 * Then edit the HTML and run scripts/encrypt-page.mjs on it. Keep the output outside git (private-src/ is ignored).
 */
import { createDecipheriv, pbkdf2Sync } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [slug, output] = process.argv.slice(2);
const password = process.env.PAGE_PASSWORD ?? "";
if (!slug || !output || !password) {
  console.error("Usage: PAGE_PASSWORD=... node scripts/decrypt-page.mjs <slug> <out.html>");
  process.exit(1);
}

const sealed = JSON.parse(readFileSync(`src/private/${slug}.json`, "utf8"));
const key = pbkdf2Sync(password, Buffer.from(sealed.salt, "base64"), sealed.iter, 32, "sha256");

function open(iv, data) {
  const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.isBuffer(iv) ? iv : Buffer.from(iv, "base64"));
  decipher.setAuthTag(bytes.subarray(bytes.length - 16));
  return Buffer.concat([decipher.update(bytes.subarray(0, bytes.length - 16)), decipher.final()]);
}

const outDir = path.dirname(path.resolve(output));
mkdirSync(outDir, { recursive: true });
const used = new Set();
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

try {
  const blocks = sealed.blocks.map((block) => {
    if (block.k === "t") return open(block.iv, block.data).toString("utf8");
    const figures = block.items.map((item, at) => {
      const meta = JSON.parse(open(item.civ, item.cdata).toString("utf8"));
      const file = readFileSync(path.join("public", item.file));
      const plain = open(file.subarray(0, 12), file.subarray(12));
      const headerLength = plain.readUInt32BE(0);
      let name = `${path.basename(meta.src ?? `picture-${used.size + 1}`, path.extname(meta.src ?? ""))}.jpg`;
      while (used.has(name)) name = `${path.basename(name, ".jpg")}-${at + 1}.jpg`;
      used.add(name);
      writeFileSync(path.join(outDir, name), plain.subarray(4 + headerLength));
      const caption = meta.caption ? `<figcaption>${meta.caption}</figcaption>` : "";
      return `<figure><img src="${name}" alt="${escape(meta.alt ?? "")}">${caption}</figure>`;
    });
    return `<div class="plates">\n${figures.join("\n")}\n</div>`;
  });
  writeFileSync(output, `${blocks.join("\n\n")}\n`);
  console.log(`Wrote ${output} (${blocks.length} blocks) and ${used.size} pictures in ${outDir}`);
} catch (error) {
  console.error("Could not decrypt. Is the key right?", error.code ?? error.message);
  process.exit(1);
}
