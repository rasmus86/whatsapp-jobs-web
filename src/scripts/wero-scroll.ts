import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import lottie, { type AnimationItem } from 'lottie-web';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

type LottieMap = Record<string, AnimationItem>;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

async function loadLottieJson(path: string): Promise<object> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Lottie fetch failed: ${path}`);
  return res.json();
}

function mountLottie(
  holder: HTMLElement,
  animationData: object,
  map: LottieMap,
  key: string,
): AnimationItem {
  const anim = lottie.loadAnimation({
    container: holder,
    renderer: 'canvas',
    loop: false,
    autoplay: false,
    animationData,
    rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
  });
  anim.addEventListener('DOMLoaded', () => {
    if (key.startsWith('hands')) {
      scrubLottie(anim, 0.12);
    }
  });
  map[key] = anim;
  return anim;
}

function scrubLottie(
  anim: AnimationItem,
  progress: number,
): void {
  const frame = Math.min(
    anim.totalFrames - 1,
    Math.max(0, Math.floor(progress * anim.totalFrames)),
  );
  anim.goToAndStop(frame, true);
}

function initHeroIntro(): void {
  const bottomBar = document.querySelector<HTMLElement>('.bottom-bar');
  const titleSpans = document.querySelectorAll<HTMLElement>('.hero__title span');
  const sticker = document.querySelector<HTMLElement>('.hero__sticker-container');
  const heroBtn = document.querySelector<HTMLElement>('.hero__button');
  const heroBtnText = heroBtn?.querySelector<HTMLElement>('.button-primary__text');
  const heroBtnLastIcon = heroBtn?.querySelector<HTMLElement>(
    '.button-primary__icon-holder:last-child',
  );
  const handsHolder = document.querySelector<HTMLElement>('[data-lottie="hands"]');
  const linesHolder = document.querySelector<HTMLElement>('.hero__lines-animation-holder');

  if (prefersReducedMotion()) {
    bottomBar?.classList.add('is-visible');
    gsap.set([titleSpans, sticker, heroBtn, handsHolder, linesHolder], {
      opacity: 1,
      y: 0,
      scale: 1,
      clearProps: 'transform',
    });
    if (heroBtnText && heroBtnLastIcon) gsap.set([heroBtnText, heroBtnLastIcon], { opacity: 1 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (handsHolder) {
    gsap.set(handsHolder, { opacity: 0 });
    tl.to(handsHolder, { opacity: 1, duration: 0.7 }, 0.05);
  }
  if (linesHolder) {
    gsap.set(linesHolder, { opacity: 0 });
    tl.to(linesHolder, { opacity: 1, duration: 0.9 }, 0.1);
  }

  tl.fromTo(
    titleSpans,
    { opacity: 0, y: 36 },
    { opacity: 1, y: 0, stagger: 0.14, duration: 0.75 },
    0.2,
  );

  if (sticker) {
    tl.fromTo(sticker, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 }, 0.55);
  }

  if (heroBtn) {
    tl.to(
      heroBtn,
      { scale: 1, duration: 0.45, ease: 'back.out(1.6)' },
      0.65,
    );
    tl.to(
      heroBtn,
      {
        width: () => Math.min(heroBtn.scrollWidth + 24, window.innerWidth * 0.92),
        duration: 0.55,
        ease: 'power3.inOut',
      },
      0.72,
    );
    if (heroBtnText && heroBtnLastIcon) {
      tl.to([heroBtnText, heroBtnLastIcon], { opacity: 1, duration: 0.35 }, 0.82);
    }
    tl.set(heroBtn, { width: 'auto', maxWidth: 'min(92vw, 720px)' }, 1.35);
  }

  if (bottomBar) {
    tl.fromTo(
      bottomBar,
      { y: 190 },
      {
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        onComplete: () => bottomBar.classList.add('is-visible'),
      },
      0.45,
    );
  }
}

function bindUi(): void {
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

  navToggle?.addEventListener('click', () => {
    nav?.classList.toggle('is-open');
    const expanded = nav?.classList.contains('is-open');
    navToggle?.setAttribute('aria-expanded', expanded ? 'true' : 'false');
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
      const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
      if (lenis) lenis.scrollTo(target, { duration: 1.2 });
      else target.scrollIntoView({ behavior: 'smooth' });
      nav?.classList.remove('is-open');
    });
  });

  const sticker = document.querySelector<HTMLElement>('.hero__sticker-container');
  sticker?.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('tijdlijn');
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    if (target && lenis) {
      const top = target.getBoundingClientRect().top + window.scrollY;
      const offset = window.matchMedia('(min-width: 1200px)').matches
        ? window.innerHeight * 0.5
        : 0;
      lenis.scrollTo(top + offset, { duration: 1.2 });
    }
  });
}

async function initScrollStory(): Promise<void> {
  if (prefersReducedMotion()) {
    initHeroIntro();
    return;
  }

  const lotties: LottieMap = {};
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  const fileByType: Record<string, string> = {
    hands: isMobile ? '/lottie/hands-mobile.json' : '/lottie/hands.json',
    lines: '/lottie/3-lijnen-voor-eerste-titelkaart.json',
    'plane-green': '/lottie/groene-vliegtuig.json',
    'plane-pink': '/lottie/roze-vliegtuig-vector.json',
    puzzle: '/lottie/puzzle-16-9-json.json',
    stopwatch: '/lottie/brand-fast-stopwatch.json',
    speedometer: '/lottie/brand-fast-speedometer.json',
    padlock: '/lottie/padlock.json',
  };

  const holders = [...document.querySelectorAll<HTMLElement>('[data-lottie]')];
  const typeCount: Record<string, number> = {};

  await Promise.all(
    holders.map(async (el) => {
      const type = el.dataset.lottie;
      if (!type) return;
      const file = fileByType[type];
      if (!file) return;
      typeCount[type] = (typeCount[type] ?? 0) + 1;
      const key = `${type}-${typeCount[type]}`;
      el.dataset.lottieKey = key;
      try {
        const data = await loadLottieJson(file);
        mountLottie(el, data, lotties, key);
      } catch (err) {
        console.warn('Lottie skip', file, err);
      }
    }),
  );

  const anim = (type: string, index = 1): AnimationItem | undefined =>
    lotties[`${type}-${index}`];

  document.documentElement.classList.add('lenis');

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
  });
  (window as Window & { __lenis?: Lenis }).__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const hero = document.querySelector('.hero');
  const heroTitle = document.querySelector('.hero__title');
  const heroSticker = document.querySelector('.hero__sticker-container');
  const heroBtnWrap = document.querySelector('.hero__button-container');
  const handsHolder = document.querySelector('[data-lottie="hands"]');

  initHeroIntro();

  const handsAnim = anim('hands');
  if (hero && handsAnim) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    tl.to(
      {},
      {
        duration: 1,
        onUpdate: function () {
          scrubLottie(handsAnim, this.progress());
        },
      },
      0,
    );

    if (heroTitle) {
      tl.fromTo(heroTitle, { y: 0, scale: 1 }, { y: '-14vh', scale: 0.86, ease: 'none' }, 0);
    }
    if (handsHolder) {
      tl.fromTo(handsHolder, { y: 0, scale: 1 }, { y: '-8vh', scale: 1.12, ease: 'none' }, 0);
    }
    if (heroSticker) {
      tl.fromTo(heroSticker, { y: 0, rotate: 0 }, { y: -120, rotate: 14, ease: 'none' }, 0);
    }
    if (heroBtnWrap) {
      tl.to(heroBtnWrap, { opacity: 0, y: 40, ease: 'none' }, 0.3);
    }
  }

  const airplanes = document.querySelector('.airplanes__container');
  if (airplanes) {
    gsap.fromTo(
      '.airplanes__title .line',
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: airplanes,
          start: 'top 78%',
          end: 'top 38%',
          scrub: 1,
        },
      },
    );

    const crossTrigger = {
      trigger: airplanes,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8,
    } as const;

    const planeGreen = anim('plane-green');
    if (planeGreen) {
      ScrollTrigger.create({
        ...crossTrigger,
        onUpdate: (self) => scrubLottie(planeGreen, self.progress),
      });
      gsap.fromTo(
        '[data-lottie="plane-green"]',
        { xPercent: -160, yPercent: 30 },
        { xPercent: 120, yPercent: -20, ease: 'none', scrollTrigger: crossTrigger },
      );
    }

    const planePink = anim('plane-pink');
    if (planePink) {
      ScrollTrigger.create({
        ...crossTrigger,
        onUpdate: (self) => scrubLottie(planePink, self.progress),
      });
      gsap.fromTo(
        '[data-lottie="plane-pink"]',
        { xPercent: 160, yPercent: -10 },
        { xPercent: -120, yPercent: 40, ease: 'none', scrollTrigger: crossTrigger },
      );
    }
  }

  const puzzle = document.querySelector('.puzzle-section');
  if (puzzle) {
    const puzzleAnim = anim('puzzle');
    if (puzzleAnim) {
      ScrollTrigger.create({
        trigger: puzzle,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 0.7,
        onUpdate: (self) => scrubLottie(puzzleAnim, self.progress),
      });
    }

    gsap.fromTo(
      '.puzzle-section__text p, .puzzle-section__top-title, .puzzle-section__title',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: puzzle, start: 'top 70%', end: 'top 35%', scrub: 1 },
      },
    );
  }

  const cards = document.querySelector('.cards-block');
  if (cards) {
    gsap.fromTo(
      '.cards-block__title',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: cards, start: 'top 75%', end: 'top 45%', scrub: 1 },
      },
    );

    const card1 = cards.querySelector('.cards-block__card--01');
    const card2 = cards.querySelector('.cards-block__card--02');
    if (card1) {
      gsap.fromTo(
        card1,
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card1, start: 'top 85%', end: 'top 55%', scrub: 0.8 },
        },
      );
    }
    if (card2) {
      gsap.fromTo(
        card2,
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card2, start: 'top 85%', end: 'top 55%', scrub: 0.8 },
        },
      );
    }

    const stopwatchCard = anim('stopwatch', 1);
    const speedometerCard = anim('speedometer', 1);
    if (stopwatchCard && card1) {
      ScrollTrigger.create({
        trigger: card1,
        start: 'top 85%',
        end: 'bottom 45%',
        scrub: 0.6,
        onUpdate: (self) => scrubLottie(stopwatchCard, self.progress),
      });
    }
    if (speedometerCard && card2) {
      ScrollTrigger.create({
        trigger: card2,
        start: 'top 85%',
        end: 'bottom 45%',
        scrub: 0.6,
        onUpdate: (self) => scrubLottie(speedometerCard, self.progress),
      });
    }
  }

  const faq = document.querySelector('.faq-section');
  if (faq) {
    const blocks = faq.querySelectorAll('.faq-section__block');
    blocks.forEach((block, i) => {
      gsap.fromTo(
        block.querySelectorAll('.faq-section__title .line'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.06,
          scrollTrigger: {
            trigger: block,
            start: 'top 70%',
            end: 'top 35%',
            scrub: 0.6,
          },
        },
      );

      const illusTypes = ['stopwatch', 'padlock', 'speedometer'];
      const illusType = illusTypes[i];
      const illusAnim = illusType ? anim(illusType, i === 0 ? 2 : 1) : undefined;
      if (illusAnim) {
        ScrollTrigger.create({
          trigger: block,
          start: 'top 60%',
          end: 'top 25%',
          scrub: 0.5,
          onUpdate: (self) => scrubLottie(illusAnim, self.progress),
        });
      }
    });
  }

  const fist = document.querySelector('.fist-bump-section');
  if (fist) {
    gsap.fromTo(
      '.fist-bump-section__title span',
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: { trigger: fist, start: 'top 80%', end: 'top 40%', scrub: 1 },
      },
    );
    gsap.fromTo(
      '.fist-bump-section__burst',
      { scale: 0.6, rotate: -8, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, scrollTrigger: { trigger: fist, start: 'top 85%', end: 'top 50%', scrub: 1 } },
    );
  }

  ScrollTrigger.addEventListener('refresh', () => lenis.resize());
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
    lenis.resize();
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

export async function initWeroPage(): Promise<void> {
  bindUi();
  try {
    await initScrollStory();
  } catch (err) {
    console.error('Scroll story init failed', err);
    initHeroIntro();
  }
}

initWeroPage();
