/** Sized Unsplash URLs — same pattern as yakkasport sport-hero-images. */

const QUALITY = 75;

function unsplash(id: string, w: number): string {
  return `https://images.unsplash.com/${id}?q=${QUALITY}&w=${w}&auto=format&fit=crop`;
}

function srcSet(id: string, widths: readonly number[]): string {
  return widths.map((w) => `${unsplash(id, w)} ${w}w`).join(', ');
}

export type MissionCard = {
  tag: string;
  alt: string;
  src: string;
  srcSet: string;
  sizes: string;
};

export const MISSION_CARDS: MissionCard[] = [
  {
    tag: 'Construction',
    alt: 'Construction worker on a building site',
    src: unsplash('photo-1541888946425-d81bb19240f5', 440),
    srcSet: srcSet('photo-1541888946425-d81bb19240f5', [180, 360, 440]),
    sizes: '(min-width: 900px) 220px, 55vw',
  },
  {
    tag: 'Hospitality',
    alt: 'Waiter serving in a restaurant',
    src: unsplash('photo-1559339352-11d035aa65de', 440),
    srcSet: srcSet('photo-1559339352-11d035aa65de', [180, 360, 440]),
    sizes: '(min-width: 900px) 220px, 55vw',
  },
  {
    tag: 'Farms',
    alt: 'Farm worker in the field',
    src: unsplash('photo-1625246333195-78d9c38ad449', 440),
    srcSet: srcSet('photo-1625246333195-78d9c38ad449', [180, 360, 440]),
    sizes: '(min-width: 900px) 220px, 55vw',
  },
];
