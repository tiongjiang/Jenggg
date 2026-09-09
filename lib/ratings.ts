export interface RatingTier {
  key: 'ewww' | 'meh' | 'okay' | 'good' | 'jengggg';
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
  meh: {
    key: 'meh',
    emoji: '😐',
    label: 'Ma Ma Dei',
    colorClass: 'text-gray-500',
    bgHex: '#8E8E93',
  },
  okay: {
    key: 'okay',
    emoji: '🙂',
    label: 'Okay Lah',
    colorClass: 'text-blue-500',
    bgHex: '#2251FF',
  },
  good: {
    key: 'good',
    emoji: '😋',
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
