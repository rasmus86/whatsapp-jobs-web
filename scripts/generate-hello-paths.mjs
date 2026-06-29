/**
 * Export hero title paths with Apple Hello lettering metrics.
 * Uses SignPainter-HouseScript Semibold (Apple script font family).
 *
 * Run: node scripts/generate-hello-paths.mjs
 */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit');

const __dirname = dirname(fileURLToPath(import.meta.url));

const fontPath = '/System/Library/Fonts/Supplemental/SignPainter.ttc';
const collection = fontkit.openSync(fontPath);
const font = collection.fonts?.[1] ?? collection.fonts?.[0] ?? collection;

const VIEW_HEIGHT = 200;
const STROKE_WIDTH = 14.8883;
const FONT_SIZE = 190;
const BASELINE = 150;

const lines = [
  { text: 'WhatsApp', splitAt: 1 },
  { text: 'Jobs', splitAt: 1 },
];

function svgPathFromGlyphPath(path) {
  return path
    .toSVG()
    .replace(/<path d="/, '')
    .replace(/" fill="none"\/>/, '')
    .replace(/Z/gi, '')
    .trim();
}

function layoutLine(text) {
  const run = font.layout(text);
  const glyphs = [];
  let cursor = 0;

  for (let i = 0; i < run.glyphs.length; i++) {
    const glyph = run.glyphs[i];
    const pos = run.positions[i];
    const x = cursor + (pos?.xOffset ?? 0);
    const y = BASELINE + (pos?.yOffset ?? 0);
    const path = glyph.path.translate(x, y).scale(FONT_SIZE / font.unitsPerEm);
    glyphs.push({ char: text[i] ?? '?', d: svgPathFromGlyphPath(path) });
    cursor += pos?.xAdvance ?? glyph.advanceWidth ?? 0;
  }

  const scale = VIEW_HEIGHT / (FONT_SIZE * 1.08);
  const scaledGlyphs = glyphs.map(({ char, d }) => ({
    char,
    d: scalePath(d, scale),
  }));

  const width = cursor * (FONT_SIZE / font.unitsPerEm) * scale;
  return { glyphs: scaledGlyphs, width, height: VIEW_HEIGHT };
}

function scalePath(d, scale) {
  return d.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, (n) => {
    const value = Number.parseFloat(n);
    return Number.isFinite(value) ? (value * scale).toFixed(3).replace(/\.?0+$/, '') : n;
  });
}

function groupPaths(glyphs, splitAt) {
  const left = glyphs.slice(0, splitAt).map((g) => g.d).join(' ');
  const right = glyphs.slice(splitAt).map((g) => g.d).join(' ');
  return [
    { id: 'stroke-1', d: left },
    { id: 'stroke-2', d: right },
  ].filter((p) => p.d.trim());
}

function toTsModule(output, fontName) {
  const body = JSON.stringify(output, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");

  return `/**
 * Hero title paths — Apple Hello lettering style.
 * Font: ${fontName}
 * Metrics match ncdai AppleHelloEnglishEffect (viewBox height 200, stroke 14.8883).
 * Generated via scripts/generate-hello-paths.mjs
 */

export type HeroTitlePath = {
  id: string;
  d: string;
};

export type HeroTitleLine = {
  text: string;
  paths: HeroTitlePath[];
  width: number;
  height: number;
  strokeWidth: number;
};

export const HERO_HELLO_STROKE_WIDTH = ${STROKE_WIDTH};

export const heroTitleLines: HeroTitleLine[] = ${body};
`;
}

const output = lines.map(({ text, splitAt }) => {
  const { glyphs, width, height } = layoutLine(text);
  return {
    text,
    paths: groupPaths(glyphs, splitAt),
    width,
    height,
    strokeWidth: STROKE_WIDTH,
  };
});

writeFileSync(
  join(__dirname, '../src/data/hero-title-paths.ts'),
  toTsModule(output, font.fullName),
);
console.log('Wrote src/data/hero-title-paths.ts using', font.fullName);
