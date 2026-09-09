'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TrainerBoy } from './TrainerBoy';

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

      {/* 2. Hunt Tab (Home/Map) */}
      <div className="relative -top-5 flex flex-col items-center z-50">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="group cursor-pointer flex flex-col items-center focus:outline-none"
        >
          <div className="w-[60px] h-[60px] rounded-full bg-bau-cream p-1 shadow-bau active:scale-95 transition-transform">
            <div className="w-full h-full rounded-full bg-bau-red border-[2px] border-bau-black relative overflow-hidden flex items-center justify-center">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white border-t-[2px] border-bau-black" />
              <div className="relative z-10 scale-110">
                <TrainerBoy scale={0.9} />
              </div>
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
