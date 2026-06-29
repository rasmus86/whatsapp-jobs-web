/**
 * Aceternity Sparkles (vanilla tsparticles)
 * https://21st.dev/community/components/aceternity/sparkles/default
 */

import { tsParticles } from '@tsparticles/engine';
import type { ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

function sparklesOptions(width: number, height: number): ISourceOptions {
  const areaFactor = (width * height) / (400 * 400);
  const particleCount = Math.round(Math.min(320, Math.max(100, 120 * areaFactor)));

  return {
  background: {
    color: { value: 'transparent' },
  },
  fullScreen: {
    enable: false,
    zIndex: 0,
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: { enable: true, mode: 'push' },
      onHover: { enable: false, mode: 'repulse' },
      resize: { enable: true },
    },
    modes: {
      push: { quantity: 4 },
      repulse: { distance: 200, duration: 0.4 },
    },
  },
  particles: {
    bounce: {
      horizontal: { value: 1 },
      vertical: { value: 1 },
    },
    collisions: {
      enable: false,
      mode: 'bounce',
      overlap: { enable: true, retries: 0 },
    },
    color: { value: '#ffffff' },
    move: {
      enable: true,
      direction: 'none',
      outModes: { default: 'out' },
      speed: { min: 0.1, max: 1 },
    },
    number: {
      density: { enable: true, width, height },
      value: particleCount,
    },
    opacity: {
      value: { min: 0.1, max: 1 },
      animation: {
        enable: true,
        speed: 4,
        sync: false,
        mode: 'auto',
        startValue: 'random',
      },
    },
    shape: { type: 'circle' },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
  };
}

async function mountHeroSparkles(): Promise<void> {
  const el = document.getElementById('hero-sparkles');
  if (!el) return;

  const hero = el.closest('.hero');
  const syncSize = () => {
    if (!hero) return;
    el.style.width = `${hero.clientWidth}px`;
    el.style.height = `${hero.clientHeight}px`;
  };
  syncSize();

  await loadSlim(tsParticles);
  await tsParticles.load({
    id: 'hero-sparkles',
    element: el,
    options: sparklesOptions(el.clientWidth, el.clientHeight),
  });

  const ro = new ResizeObserver(() => {
    syncSize();
    const instance = tsParticles.domItem(el.id);
    if (instance) {
      void instance.refresh();
    }
  });
  if (hero) ro.observe(hero);

  el.classList.add('is-ready');
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('sparkles-static');
} else {
  mountHeroSparkles().catch(console.error);
}
