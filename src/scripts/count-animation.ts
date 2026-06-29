/**
 * Bundui Count Animation (vanilla)
 * https://21st.dev/community/components/bundui/count-animation/default
 */

const DURATION_MS = 2000;

function formatCount(el: HTMLElement, value: number): string {
  const prefix = el.dataset.prefix ?? '';
  const suffix = el.dataset.suffix ?? '';
  const raw = el.dataset.locale === 'false' ? String(value) : value.toLocaleString('en-AU');
  return `${prefix}${raw}${suffix}`;
}

function animateCount(el: HTMLElement, target: number): void {
  const start = performance.now();

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / DURATION_MS);
    const eased = 1 - (1 - progress) ** 3;
    const current = Math.round(target * eased);
    el.textContent = formatCount(el, current);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = formatCount(el, target);
  };

  el.textContent = formatCount(el, 0);
  requestAnimationFrame(tick);
}

function initCountAnimations(): void {
  const values = document.querySelectorAll<HTMLElement>('[data-count-value]');
  if (!values.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const run = (el: HTMLElement) => {
    if (el.dataset.countAnimated === 'true') return;
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    el.dataset.countAnimated = 'true';
    animateCount(el, target);
  };

  const section = document.querySelector('[data-count-section]');
  if (!section) {
    values.forEach((el) => run(el));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        section.querySelectorAll<HTMLElement>('[data-count-value]').forEach(run);
        observer.disconnect();
        break;
      }
    },
    { threshold: 0.35 },
  );

  observer.observe(section);
}

initCountAnimations();
