/** Single-open FAQ accordion for [data-faq-accordion] lists. */

function initFaqAccordion(): void {
  document.querySelectorAll<HTMLElement>('[data-faq-accordion]').forEach((root) => {
    const items = Array.from(root.querySelectorAll<HTMLElement>('.faq__item'));

    items.forEach((item) => {
      const button = item.querySelector<HTMLButtonElement>('.faq__question');
      const panel = item.querySelector<HTMLElement>('.faq__answer');
      if (!button || !panel) return;

      button.addEventListener('click', () => {
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        items.forEach((other) => {
          const otherButton = other.querySelector<HTMLButtonElement>('.faq__question');
          const otherPanel = other.querySelector<HTMLElement>('.faq__answer');
          if (!otherButton || !otherPanel) return;

          otherButton.setAttribute('aria-expanded', 'false');
          otherPanel.hidden = true;
          other.classList.remove('is-open');
        });

        if (!isOpen) {
          button.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
          item.classList.add('is-open');
        }
      });
    });
  });
}

initFaqAccordion();
