import { onIdle, onNearViewport } from '../lib/schedule-idle';

import './count-animation.ts';

onNearViewport('#faq', () => {
  void import('./faq-accordion.ts');
  void import('./liquid-text.ts');
});

onIdle(() => {
  void import('./powered-by-balloons.ts');
}, 3500);
