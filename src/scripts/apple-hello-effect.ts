/**
 * AppleHelloEnglishEffect (vanilla port)
 * https://21st.dev/community/components/ncdai/apple-hello-effect/default
 */

import { appleHelloEnglishPaths } from '../data/apple-hello-english';

type PathTiming = {
  duration: number;
  delay: number;
  opacityDuration: number;
  opacityDelay: number;
  ease: string;
};

const DEFAULT_SPEED = 1.1;

const EASE_MAP: Record<string, string> = {
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
};

function calc(value: number, speed: number): number {
  return value * speed;
}

function parseSpeed(svg: SVGSVGElement): number {
  const raw = svg.dataset.speed;
  if (!raw) return DEFAULT_SPEED;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SPEED;
}

function buildTimings(speed: number): PathTiming[] {
  return appleHelloEnglishPaths.map((path) => ({
    duration: calc(path.duration, speed),
    delay: calc(path.delay, speed),
    opacityDuration: calc(path.opacityDuration, speed),
    opacityDelay: calc(path.opacityDelay, speed),
    ease: EASE_MAP[path.ease] ?? EASE_MAP.easeInOut!,
  }));
}

function preparePath(path: SVGPathElement): number {
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;
  path.style.opacity = '0';
  return length;
}

function animatePath(path: SVGPathElement, timing: PathTiming): void {
  const length = path.getTotalLength();

  path.animate(
    [{ strokeDashoffset: `${length}` }, { strokeDashoffset: '0' }],
    {
      duration: timing.duration * 1000,
      delay: timing.delay * 1000,
      easing: timing.ease,
      fill: 'forwards',
    },
  );

  path.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: timing.opacityDuration * 1000,
    delay: timing.opacityDelay * 1000,
    easing: 'ease-out',
    fill: 'forwards',
  });
}

function showStaticPaths(svg: SVGSVGElement): void {
  svg.querySelectorAll<SVGPathElement>('path[data-hello-path]').forEach((path) => {
    path.style.strokeDasharray = 'none';
    path.style.strokeDashoffset = '0';
    path.style.opacity = '1';
  });
  svg.classList.add('apple-hello--static');
}

function mountAppleHello(svg: SVGSVGElement): void {
  const speed = parseSpeed(svg);
  const paths = [...svg.querySelectorAll<SVGPathElement>('path[data-hello-path]')];
  if (!paths.length) return;

  paths.forEach(preparePath);

  const timings = buildTimings(speed);
  paths.forEach((path, index) => animatePath(path, timings[index]!));

  svg.classList.add('apple-hello--mounted');
}

function initAppleHelloEffect(): void {
  const svgs = document.querySelectorAll<SVGSVGElement>('[data-apple-hello]');
  if (!svgs.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('apple-hello-static');
    svgs.forEach(showStaticPaths);
    return;
  }

  svgs.forEach(mountAppleHello);
}

initAppleHelloEffect();
