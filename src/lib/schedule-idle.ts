/** ponytail: single idle helper; upgrade path = scheduler.postTask when widely available */
export function onIdle(fn: () => void, timeout = 2200): void {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(fn, { timeout });
  } else {
    window.setTimeout(fn, 200);
  }
}

export function onNearViewport(selector: string, fn: () => void, rootMargin = '240px'): void {
  const el = document.querySelector(selector);
  if (!el) {
    fn();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      fn();
    },
    { rootMargin },
  );

  observer.observe(el);
}
