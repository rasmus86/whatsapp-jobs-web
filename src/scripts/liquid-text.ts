/**
 * Ali Imam Liquid Text (vanilla port)
 * https://21st.dev/community/components/aliimam/liquid-text/liquid-text
 */

const MORPH_TIME = 1.5;
const COOLDOWN_TIME = 0.5;

type LiquidTextState = {
  textIndex: number;
  morph: number;
  cooldown: number;
  lastTime: number;
  layer1: HTMLSpanElement;
  layer2: HTMLSpanElement;
  texts: string[];
  rafId: number;
};

function parseTexts(el: HTMLElement): string[] {
  const raw = el.dataset.texts;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function setLayerStyles(state: LiquidTextState, fraction: number): void {
  const { texts, textIndex, layer1, layer2 } = state;
  if (!texts.length) return;

  const safeFraction = Math.max(fraction, 0.0001);
  const inverted = 1 - fraction;
  const safeInverted = Math.max(inverted, 0.0001);

  layer2.style.filter = `blur(${Math.min(8 / safeFraction - 8, 100)}px)`;
  layer2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  layer1.style.filter = `blur(${Math.min(8 / safeInverted - 8, 100)}px)`;
  layer1.style.opacity = `${Math.pow(inverted, 0.4) * 100}%`;

  layer1.textContent = texts[textIndex % texts.length];
  layer2.textContent = texts[(textIndex + 1) % texts.length];
}

function doMorph(state: LiquidTextState): void {
  state.morph -= state.cooldown;
  state.cooldown = 0;

  let fraction = state.morph / MORPH_TIME;
  if (fraction > 1) {
    state.cooldown = COOLDOWN_TIME;
    fraction = 1;
  }

  setLayerStyles(state, fraction);

  if (fraction === 1) {
    state.textIndex += 1;
  }
}

function doCooldown(state: LiquidTextState): void {
  state.morph = 0;
  state.layer2.style.filter = 'none';
  state.layer2.style.opacity = '100%';
  state.layer1.style.filter = 'none';
  state.layer1.style.opacity = '0%';
}

function tick(state: LiquidTextState, now: number): void {
  const dt = (now - state.lastTime) / 1000;
  state.lastTime = now;
  state.cooldown -= dt;

  if (state.cooldown <= 0) doMorph(state);
  else doCooldown(state);

  state.rafId = requestAnimationFrame((t) => tick(state, t));
}

function mountLiquidText(el: HTMLElement): LiquidTextState | null {
  const texts = parseTexts(el);
  if (!texts.length) return null;

  el.innerHTML = '';
  el.classList.add('liquid-text--mounted');

  const layer1 = document.createElement('span');
  const layer2 = document.createElement('span');
  layer1.className = 'liquid-text__layer';
  layer2.className = 'liquid-text__layer';
  el.append(layer1, layer2);

  const state: LiquidTextState = {
    textIndex: 0,
    morph: 0,
    cooldown: 0,
    lastTime: performance.now(),
    layer1,
    layer2,
    texts,
    rafId: 0,
  };

  layer2.textContent = texts[0];
  layer2.style.opacity = '100%';
  layer1.style.opacity = '0%';

  state.rafId = requestAnimationFrame((t) => tick(state, t));
  return state;
}

function ensureSvgFilter(): void {
  if (document.getElementById('hero-liquid-threshold')) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', 'hero-liquid-filters');
  svg.setAttribute('class', 'liquid-text__filters');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

  svg.innerHTML = `
    <defs>
      <filter id="hero-liquid-threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  `;

  document.body.appendChild(svg);
}

function initLiquidText(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-liquid-text]');
  if (!roots.length) return;

  ensureSvgFilter();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('liquid-text-static');
    roots.forEach((el) => {
      const texts = parseTexts(el);
      if (!texts.length) return;
      el.textContent = texts[0];
      el.classList.add('liquid-text--mounted');
    });
    return;
  }

  roots.forEach((el) => mountLiquidText(el));
}

initLiquidText();
