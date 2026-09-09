'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { supabase, Place } from '@/lib/supabase';
import { TrainerBoy } from '@/components/TrainerBoy';
import { SaoDrawer } from '@/components/SaoDrawer';

// Dynamically import Leaflet map
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
      {/* Top HUD */}
      <div className="absolute top-4 left-3.5 right-3.5 z-30 flex items-center justify-between pointer-events-none">
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

        {/* Meaningful Location & Places Counter (Replaces meaningless 3-day streak) */}
        <div className="pointer-events-auto bg-bau-yellow border-[2.5px] border-bau-black rounded-full px-3 py-1 font-baloo font-extrabold text-xs shadow-bau-sm flex items-center gap-1.5">
          <span>📍</span>
          <span>{places.length} Spots in KL</span>
        </div>
      </div>

      {/* Clean Spacious Search Bar */}
      <div className="absolute top-[68px] left-3.5 right-3.5 z-30">
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

            {/* SAO Metallic Filter Trigger Orb (Toggles Dropdown Underneath) */}
      <button
        type="button"
        onClick={() => setIsSaoOpen(!isSaoOpen)}
        className={`absolute top-28 right-3.5 z-50 w-11 h-11 rounded-full border-[2.5px] border-bau-black flex items-center justify-center transition-all duration-200 active:scale-95 ${
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


      {/* SAO Menu Drawer */}
      <SaoDrawer
        isOpen={isSaoOpen}
        onClose={() => setIsSaoOpen(false)}
        currentFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Interactive Map with In-Place Popups */}
      <div className="flex-1 w-full h-full relative z-10">
        <LeafletMap places={filteredPlaces} />
      </div>

      {/* Request Hunt Floating Action Button */}
      <button
        type="button"
        onClick={() => router.push('/request')}
        className="absolute bottom-6 right-3.5 z-30 bg-bau-red text-white border-[2.5px] border-bau-black rounded-full py-2.5 px-4 font-baloo font-extrabold text-xs shadow-bau flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-transform"
      >
        <span>🎯</span>
        <span>Request Hunt</span>
      </button>
    </div>
  );
}
