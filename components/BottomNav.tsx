'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TrainerBoy } from './TrainerBoy';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Hide nav on sub-screens like Place Details or Submit Request
  if (pathname.startsWith('/places/') || pathname === '/request') {
    return null;
  }

  return (
    <nav className="relative h-[72px] bg-bau-cream border-t-[2.5px] border-bau-black flex items-center justify-around pb-[env(safe-area-inset-bottom,4px)] z-40 shrink-0 select-none">
      {/* 1. Explore Tab */}
      <button
        type="button"
        onClick={() => router.push('/')}
        className={`flex-1 flex flex-col items-center justify-center gap-1 font-baloo font-bold text-xs transition-colors ${
          pathname === '/' ? 'text-bau-blue font-extrabold' : 'text-gray-500 hover:text-bau-black'
        }`}
      >
        <span className="text-xl">🗺️</span>
        <span>Explore</span>
      </button>

      {/* 2. Floating Center Poké-Hunt Action Button (Elevated above border) */}
      <div className="relative -top-5 flex flex-col items-center z-50">
        <button
          type="button"
          onClick={() => router.push('/hunt')}
          className="group cursor-pointer flex flex-col items-center focus:outline-none"
        >
          {/* Circular Button with outer halo ring to mask the black border */}
          <div className="w-[62px] h-[62px] rounded-full bg-bau-cream p-1 shadow-bau active:scale-95 transition-transform">
            <div className="w-full h-full rounded-full bg-bau-red border-[2px] border-bau-black relative overflow-hidden flex items-center justify-center">
              {/* Bottom half of Pokéball */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white border-t-[2px] border-bau-black" />
              {/* 2D Retro Pokémon Boy Character */}
              <div className="relative z-10 scale-110">
                <TrainerBoy scale={0.9} />
              </div>
            </div>
          </div>
          <span
            className={`font-baloo font-extrabold text-[11px] mt-0.5 tracking-wide ${
              pathname === '/hunt' ? 'text-bau-red' : 'text-bau-black'
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
        className={`flex-1 flex flex-col items-center justify-center gap-1 font-baloo font-bold text-xs transition-colors ${
          pathname === '/profile' ? 'text-bau-blue font-extrabold' : 'text-gray-500 hover:text-bau-black'
        }`}
      >
        <span className="text-xl">🏆</span>
        <span>Hunter</span>
      </button>
    </nav>
  );
};
