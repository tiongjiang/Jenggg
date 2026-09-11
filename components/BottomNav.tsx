'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith('/places/') || pathname === '/request') {
    return null;
  }

  return (
    <nav className="relative h-[calc(60px+env(safe-area-inset-bottom,20px))] bg-bau-cream border-t-[2.5px] border-bau-black flex items-center justify-around pt-1 pb-[env(safe-area-inset-bottom,16px)] z-40 shrink-0 select-none">
      
      {/* 1. Saved Tab */}
      <button
        type="button"
        onClick={() => router.push('/saved')}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 font-baloo font-bold text-xs transition-colors ${
          pathname === '/saved' ? 'text-bau-blue font-extrabold' : 'text-gray-500'
        }`}
      >
        <span className="text-xl">⭐</span>
        <span>Saved</span>
      </button>

      {/* 2. Hunt Tab (Center Floating Pixel Burger Button) */}
      <div className="relative -top-5 flex flex-col items-center z-50">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="group cursor-pointer flex flex-col items-center focus:outline-none"
        >
          <div className="w-[62px] h-[62px] rounded-full bg-bau-cream p-1 shadow-bau active:scale-95 transition-transform flex items-center justify-center border-[2.5px] border-bau-black">
            <div className="w-full h-full rounded-full bg-bau-yellow border-[2px] border-bau-black flex items-center justify-center shadow-inner">
              {/* Retro Pixel Art Burger SVG */}
              <svg viewBox="0 0 32 32" width="34" height="34" shapeRendering="crispEdges">
                {/* Top Bun */}
                <rect x="6" y="7" width="20" height="7" rx="3" fill="#E59830" stroke="#141416" strokeWidth="1.8" />
                {/* Sesame Seeds */}
                <rect x="10" y="9" width="2" height="1" fill="#FFFDF7" />
                <rect x="15" y="8" width="2" height="1" fill="#FFFDF7" />
                <rect x="19" y="10" width="2" height="1" fill="#FFFDF7" />
                {/* Fresh Lettuce */}
                <rect x="5" y="14" width="22" height="2" fill="#00B368" />
                <rect x="6" y="15" width="20" height="1" fill="#008F53" />
                {/* Juicy Tomato */}
                <rect x="7" y="16" width="18" height="2" fill="#FF3B30" />
                {/* Melted Cheese */}
                <polygon points="8,18 24,18 21,21 11,21" fill="#FFCC00" />
                {/* Beef Patty */}
                <rect x="5" y="19" width="22" height="4" rx="1.5" fill="#5C3317" stroke="#141416" strokeWidth="1.5" />
                {/* Bottom Bun */}
                <rect x="6" y="23" width="20" height="4" rx="2" fill="#E59830" stroke="#141416" strokeWidth="1.8" />
              </svg>
            </div>
          </div>
          <span
            className={`font-baloo font-extrabold text-[11px] mt-0.5 tracking-wide ${
              pathname === '/' ? 'text-bau-red' : 'text-bau-black'
            }`}
          >
            Hunt
          </span>
        </button>
      </div>

      {/* 3. Hunter Profile Tab */}
      <button
        type="button"
        onClick={() => router.push('/profile')}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 font-baloo font-bold text-xs transition-colors ${
          pathname === '/profile' ? 'text-bau-blue font-extrabold' : 'text-gray-500'
        }`}
      >
        <span className="text-xl">🏆</span>
        <span>Hunter</span>
      </button>
    </nav>
  );
};
