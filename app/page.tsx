'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { supabase, Place } from '@/lib/supabase';
import { TrainerBoy } from '@/components/TrainerBoy';
import { SaoDrawer } from '@/components/SaoDrawer';

const LeafletMap = dynamic(() => import('@/components/LeafletMapComponent'), { ssr: false });

export default function HomePage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isSaoOpen, setIsSaoOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadPlaces() {
      const { data, error } = await supabase.from('places').select('*');
      if (!error && data) {
        setPlaces(data as Place[]);
      }
    }
    loadPlaces();
  }, []);

  const filteredPlaces = places.filter((p) => {
    let matchesFilter = true;

    if (activeFilter === 'all') {
      matchesFilter = true;
    } else if (activeFilter === 'requested') {
      matchesFilter = Boolean(p.is_requested);
    } else if (activeFilter.startsWith('cat:')) {
      const catKey = activeFilter.replace('cat:', '').toLowerCase();
      matchesFilter = p.category ? p.category.toLowerCase().includes(catKey) : false;
    } else {
      matchesFilter = p.current_tier === activeFilter;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.area && p.area.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      {/* 1. Top HUD: Positioned below iPhone Notch / Dynamic Island */}
      <div className="absolute top-[calc(env(safe-area-inset-top,44px)+8px)] left-3.5 right-3.5 z-30 flex items-center justify-between pointer-events-none">
        <div
          onClick={() => router.push('/profile')}
          className="pointer-events-auto flex items-center gap-2 bg-bau-cream border-[2.5px] border-bau-black shadow-bau-sm rounded-full py-1 px-3 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-bau-red border-2 border-bau-black flex items-center justify-center overflow-hidden">
            <TrainerBoy scale={0.75} />
          </div>
          <div>
            <div className="font-baloo font-extrabold text-xs leading-none">Lv.8 Hunter</div>
            <div className="w-10 h-1 bg-[#E0DAC8] rounded-full overflow-hidden border border-bau-black mt-1">
              <div className="w-3/4 h-full bg-bau-yellow" />
            </div>
          </div>
        </div>

        {/* Real Live Spots Counter */}
        <div className="pointer-events-auto bg-bau-yellow border-[2.5px] border-bau-black rounded-full px-3 py-1 font-baloo font-extrabold text-xs shadow-bau-sm flex items-center gap-1.5">
          <span>📍</span>
          <span>{places.length} Spots in KL</span>
        </div>
      </div>

      {/* 2. Search Bar: Safe spacing below HUD */}
      <div className="absolute top-[calc(env(safe-area-inset-top,44px)+58px)] left-3.5 right-3.5 z-30">
        <div className="bg-bau-cream border-[2.5px] border-bau-black rounded-2xl p-2.5 flex items-center gap-2.5 shadow-bau">
          <div className="w-7 h-7 rounded-full bg-bau-yellow border-2 border-bau-black flex items-center justify-center text-xs shrink-0">
            🔍
          </div>
          <input
            type="text"
            placeholder="Search food, stalls, areas…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none bg-transparent outline-none font-semibold text-xs text-bau-black flex-1"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-gray-500 font-bold px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. SAO Filter Toggle Button */}
      <button
        type="button"
        onClick={() => setIsSaoOpen(!isSaoOpen)}
        className={`absolute top-[calc(env(safe-area-inset-top,44px)+116px)] right-3.5 z-30 w-11 h-11 rounded-full border-[2.5px] border-bau-black flex items-center justify-center transition-all duration-200 active:scale-95 ${
          isSaoOpen
            ? 'bg-bau-yellow shadow-[0_0_16px_#FFCC00] scale-105'
            : 'bg-bau-cream shadow-bau hover:scale-105'
        }`}
        title="Toggle Filter Menu"
      >
        <span className="text-lg font-space font-extrabold text-bau-black">
          {isSaoOpen ? '▲' : '⬡'}
        </span>
      </button>

      {/* Smooth Slide Down/Up Filter Menu */}
      <SaoDrawer
        isOpen={isSaoOpen}
        onClose={() => setIsSaoOpen(false)}
        currentFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* 4. Interactive Map */}
      <div className="flex-1 w-full h-full relative z-10">
        <LeafletMap places={filteredPlaces} />
      </div>

      {/* 5. Request Hunt FAB */}
      <button
        type="button"
        onClick={() => router.push('/request')}
        className="absolute bottom-5 right-3.5 z-30 bg-bau-red text-white border-[2.5px] border-bau-black rounded-full py-2.5 px-4 font-baloo font-extrabold text-xs shadow-bau flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-transform"
      >
        <span>🎯</span>
        <span>Request Hunt</span>
      </button>
    </div>
  );
}
