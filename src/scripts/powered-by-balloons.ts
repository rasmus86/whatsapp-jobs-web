/**
 * Powered by YAKKA — text balloons effect
 * https://21st.dev/community/components/serafim/balloons/text
 */

const LAUNCH_COOLDOWN_MS = 4000;

let lastLaunch = 0;
let balloonsPromise: Promise<typeof import('balloons-js')> | null = null;

function loadBalloons() {
  balloonsPromise ??= import('balloons-js');
  return balloonsPromise;
}

async function launchYakkaBalloons(): Promise<void> {
  const now = Date.now();
  if (now - lastLaunch < LAUNCH_COOLDOWN_MS) return;
  lastLaunch = now;

  const { textBalloons } = await loadBalloons();
  textBalloons([{ text: 'YAKKA', fontSize: 96, color: '#ffd640' }]);
}

function initPoweredByFloat(): void {
  const trigger = document.getElementById('powered-by-yakka');
  if (!trigger) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  trigger.addEventListener('click', () => {
    void launchYakkaBalloons();
  });
}

initPoweredByFloat();
