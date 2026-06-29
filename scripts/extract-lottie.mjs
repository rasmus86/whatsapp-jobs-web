/**
 * Extracts Lottie JSON embedded in Wero Nuxt bundles (dev reference only).
 * Usage: node scripts/extract-lottie.mjs
 */
import { writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../public/lottie');
const CHUNK_URL =
  'https://sowieso.wero-wallet.eu/_nuxt/Cd_iCvQE.js';

mkdirSync(outDir, { recursive: true });

const res = await fetch(CHUNK_URL);
const t = await res.text();

function extractJsonParse(s, start) {
  let i = s.indexOf("JSON.parse('", start) + "JSON.parse('".length;
  let escape = false;
  const buf = [];
  while (i < s.length) {
    const c = s[i];
    if (escape) {
      buf.push(c);
      escape = false;
    } else if (c === '\\') {
      buf.push(c);
      escape = true;
    } else if (c === "'") break;
    else buf.push(c);
    i += 1;
  }
  return JSON.parse(buf.join(''));
}

const patA =
  /="([^"]+)"\s*,\s*(\w+)=(\d+)\s*,\s*(\w+)=(\d+)\s*,\s*(\w+)=\{g:"@lottiefiles\/toolkit-js[^"]*"(?:,tc:"[^"]*")?\}\s*,\s*(\w+)=JSON\.parse\(/g;

const patB =
  /="([^"]+)"\s*,\s*(\w+)=(\d+)\s*,\s*(\w+)=(\d+)\s*,\s*(\w+)=(\d+)\s*,\s*(\w+)=\{g:"@lottiefiles\/toolkit-js[^"]*"(?:,tc:"[^"]*")?\}\s*,\s*(\w+)=JSON\.parse\(/g;

const patC =
  /="([^"]+)"\s*,\s*\w+=(\d+)\s*,\s*\w+=(\d+)\s*,\s*\w+=(\d+)\s*,\s*\w+=\{g:"@lottiefiles\/toolkit-js[^"]*"(?:,tc:"[^"]*")?\}\s*,\s*(\w+)=JSON\.parse\(/g;

const patD =
  /="([^"]+)"\s*,\s*\w+=(\d+)\s*,\s*\w+=(\d+)\s*,\s*\w+=\{g:"@lottiefiles\/toolkit-js[^"]*"(?:,tc:"[^"]*")?\}\s*,\s*(\w+)=JSON\.parse\(/g;

function slug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function save(name, w, h, layers) {
  const op = Math.max(
    ...layers.filter((ly) => ly && typeof ly === 'object').map((ly) => ly.op ?? 150),
    150,
  );
  const anim = {
    v: '5.7.0',
    fr: 60,
    ip: 0,
    op,
    w,
    h,
    nm: name,
    layers,
  };
  writeFileSync(join(outDir, `${slug(name)}.json`), JSON.stringify(anim));
  console.log('wrote', slug(name), w, h);
}

const seen = new Set();

for (const m of t.matchAll(patA)) {
  const name = m[1];
  const w = Number(m[3]);
  const h = Number(m[5]);
  const key = `${name}-${w}-${h}`;
  if (seen.has(key)) continue;
  seen.add(key);
  save(name, w, h, extractJsonParse(t, m.index));
}

for (const m of t.matchAll(patB)) {
  const name = m[1];
  const w = Number(m[5]);
  const h = Number(m[7]);
  const key = `${name}-${w}-${h}`;
  if (seen.has(key)) continue;
  seen.add(key);
  save(name, w, h, extractJsonParse(t, m.index));
}

for (const m of t.matchAll(patC)) {
  const name = m[1];
  const w = Number(m[2]);
  const h = Number(m[3]);
  const key = `${name}-${w}-${h}`;
  if (seen.has(key)) continue;
  seen.add(key);
  save(name, w, h, extractJsonParse(t, m.index));
}

for (const m of t.matchAll(patD)) {
  const name = m[1];
  const w = Number(m[2]);
  const h = Number(m[3]);
  const key = `${name}-${w}-${h}`;
  if (seen.has(key)) continue;
  seen.add(key);
  save(name, w, h, extractJsonParse(t, m.index));
}

console.log('done:', readdirSync(outDir).length, 'files');
