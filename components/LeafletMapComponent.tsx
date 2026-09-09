import { RATING_TIERS } from '@/lib/ratings';

function createPinIcon(tier: string | null, isRequested: boolean) {
  const isReq = Boolean(isRequested);
  const tierClass = isReq ? 'pin-requested' : `pin-${tier || 'meh'}`;
  
  // Access rating label from shared constants
  const ratingDef = RATING_TIERS[tier || 'meh'];
  const label = isReq ? '🎯 Requested' : `${ratingDef.emoji} ${ratingDef.label}`;

  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div class="bauhaus-pin ${tierClass}">
        <div class="pin-badge" style="background-color: ${isReq ? '#FFFFFF' : ratingDef.bgHex}">${label}</div>
        <div class="pin-stem" style="background-color: ${isReq ? '#FFFFFF' : ratingDef.bgHex}"></div>
      </div>
    `,
    iconSize: [80, 42],
    iconAnchor: [40, 42],
    popupAnchor: [0, -42],
  });
}
