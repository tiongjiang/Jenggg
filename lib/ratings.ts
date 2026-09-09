export interface RatingTier {
  key: 'ewww' | 'hmmm' | 'mamadei' | 'hociakk' | 'jengggg';
  emoji: string;
  label: string;
  colorClass: string;
  bgHex: string;
}

export const RATING_TIERS: Record<string, RatingTier> = {
  ewww: {
    key: 'ewww',
    emoji: '😖',
    label: 'Ewww',
    colorClass: 'text-purple-600',
    bgHex: '#7B3294',
  },
  hmmm: {
    key: 'hmmm',
    emoji: '🤨',
    label: 'Hmmm',
    colorClass: 'text-gray-500',
    bgHex: '#A0A4B8',
  },
  mamadei: {
    key: 'mamadei',
    emoji: '😐',
    label: 'Ma Ma Dei',
    colorClass: 'text-gray-500',
    bgHex: '#F4EEDC',
  },
  hociakk: {
    key: 'hociakk',
    emoji: '🤤',
    label: 'Hociakk',
    colorClass: 'text-green-500',
    bgHex: '#00B368',
  },
  jengggg: {
    key: 'jengggg',
    emoji: '🔥',
    label: 'Jengggg',
    colorClass: 'text-yellow-500',
    bgHex: '#FFCC00',
  },
};
