import React from 'react';

interface TrainerBoyProps {
  scale?: number;
}

export const TrainerBoy: React.FC<TrainerBoyProps> = ({ scale = 1 }) => {
  return (
    <div
      style={{
        width: `${28 * scale}px`,
        height: `${34 * scale}px`,
        imageRendering: 'pixelated',
      }}
      className="inline-block align-middle select-none"
    >
      <svg viewBox="0 0 16 18" shapeRendering="crispEdges" className="w-full h-full block">
        {/* Red Cap */}
        <rect x="4" y="1" width="8" height="4" fill="#FF3B30" />
        <rect x="3" y="4" width="11" height="2" fill="#FF3B30" />
        {/* White Visor & Crest */}
        <rect x="2" y="5" width="4" height="1" fill="#FFFFFF" />
        <rect x="6" y="3" width="3" height="2" fill="#FFFFFF" />
        {/* Hair */}
        <rect x="4" y="5" width="8" height="2" fill="#201C1B" />
        <rect x="2" y="6" width="3" height="4" fill="#201C1B" />
        <rect x="11" y="6" width="3" height="4" fill="#201C1B" />
        {/* Face */}
        <rect x="5" y="6" width="6" height="5" fill="#FFDFC4" />
        {/* Eyes */}
        <rect x="6" y="8" width="1" height="2" fill="#141416" />
        <rect x="9" y="8" width="1" height="2" fill="#141416" />
        {/* Retro Red/Blue Jacket */}
        <rect x="4" y="11" width="8" height="4" fill="#2251FF" />
        <rect x="6" y="11" width="4" height="4" fill="#FF3B30" />
        <rect x="6" y="11" width="4" height="1" fill="#FFFFFF" />
        {/* Pants & Shoes */}
        <rect x="5" y="15" width="6" height="2" fill="#3D405B" />
        <rect x="4" y="17" width="3" height="1" fill="#FF3B30" />
        <rect x="9" y="17" width="3" height="1" fill="#FF3B30" />
      </svg>
    </div>
  );
};
