'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TrainerBoy } from './TrainerBoy';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Hide bottom nav on detail and form screens
  if (pathname.startsWith('/places/') || pathname === '/request') {
    return null;
  }

  return (
    <nav className="h-[76px] bg-bau-cream border-t-[2.5px] border-bau-black flex items-center justify-around pb-[env(safe-area-inset-bottom,6px)] z-40 shrink-0 select-none">
      {/* Explore Tab */}
      <button
        onClick={() => router.push('/')}
        className={`flex flex-col items-center gap-1 font-baloo font-bold text-xs px-5 transition-colors ${
          pathname === '/' ? 'text-bau-blue font-extrabold' : 'text-gray-500'
        }`}
      >
        <span className="text-xl">🗺️</span>
        <span>Explore</span>
      </button>

      {/* Center Lifted Poké-Trainer Action Button */}
      <button
        onClick={() => router.push('/hunt')}
        className="relative -top-4 flex flex-col items-center group cursor-pointer"
      >
        <div className="w-[58px] h-[58px] rounded-full bg-bau-red border-[2.5px] border-bau-black flex items-center justify-center shadow-bau relative overflow-hidden transition-transform active:scale-95">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white border-t-2 border-bau-black" />
          <div className="relative z-10 scale-110">
            <TrainerBoy />
          </div>
        </div>
        <span
          className={`font-baloo font-extrabold text-[11px] mt-1 ${
            pathname === '/hunt' ? 'text-bau-red' : 'text-bau-black'
          }`}
        >
          Hunt
        </span>
      </button>

      {/* Hunter Profile Tab */}
      <button
        onClick={() => router.push('/profile')}
        className={`flex flex-col items-center gap-1 font-baloo font-bold text-xs px-5 transition-colors ${
          pathname === '/profile' ? 'text-bau-blue font-extrabold' : 'text-gray-500'
        }`}
      >
        <span className="text-xl">🏆</span>
        <span>Hunter</span>
      </button>
    </nav>
  );
};
