/** Lightweight interactions matching Wero landing behaviour. */
export function initWeroPage(): void {
  const progress = document.querySelector<HTMLElement>('.scroll-progress');
  const heroBtn = document.querySelector<HTMLElement>('.hero__button');
  const nav = document.querySelector<HTMLElement>('.navigation');
  const navToggle = document.querySelector<HTMLElement>('.navigation__toggle');
  const faqOverlay = document.getElementById('faq-overlay');
  const faqOpeners = document.querySelectorAll<HTMLElement>('[data-open-faq]');
  const faqClose = document.querySelector<HTMLElement>('[data-close-faq]');

  const onScroll = (): void => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${p})`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  window.setTimeout(() => {
    heroBtn?.classList.add('is-ready');
  }, 600);

  navToggle?.addEventListener('click', () => {
    nav?.classList.toggle('is-open');
  });

  const openFaq = (): void => {
    faqOverlay?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeFaq = (): void => {
    faqOverlay?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  faqOpeners.forEach((el) => el.addEventListener('click', openFaq));
  faqClose?.addEventListener('click', closeFaq);

  document.querySelectorAll<HTMLElement>('.faq-overlay__item').forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('.faq-overlay__question');
    const answer = item.querySelector<HTMLElement>('.faq-overlay__answer');
    const inner = item.querySelector<HTMLElement>('.faq-overlay__answer-inner');
    if (!btn || !answer || !inner) return;

    btn.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq-overlay__item.is-open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          const a = other.querySelector<HTMLElement>('.faq-overlay__answer');
          if (a) a.style.height = '0px';
        }
      });
      if (open) {
        item.classList.remove('is-open');
        answer.style.height = '0px';
      } else {
        item.classList.add('is-open');
        answer.style.height = `${inner.scrollHeight}px`;
      }
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      nav?.classList.remove('is-open');
    });
  });
}

initWeroPage();
