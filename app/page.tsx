'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { supabase, Place } from '@/lib/supabase';
import { TrainerBoy } from '@/components/TrainerBoy';
import { SaoDrawer } from '@/components/SaoDrawer';

// Dynamically import Leaflet map to avoid server-side rendering issues
const LeafletMap = dynamic(() => import('@/components/LeafletMapComponent'), { ssr: false });

export default function HomePage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isSaoOpen, setIsSaoOpen] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
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

  // Filter places based on SAO filter and search input
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

        <div className="pointer-events-auto bg-bau-yellow border-[2.5px] border-bau-black rounded-full px-3 py-1 font-baloo font-extrabold text-xs shadow-bau-sm">
          🔥 3-day streak
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
              onClick={() => setSearchQuery('')}
              className="text-xs text-gray-500 font-bold px-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* SAO Menu Floating Trigger Orb */}
      <button
        onClick={() => setIsSaoOpen(true)}
        className="absolute top-44 right-3 z-30 w-11 h-11 rounded-full bg-gradient-to-b from-white to-[#D1D5DB] border-[2px] border-[#6B7280] shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        title="Open SAO Filters"
      >
        <span className="text-xl">⚡</span>
      </button>

      {/* Authentic SAO Circular Node Menu & Sub-panel */}
      <SaoDrawer
        isOpen={isSaoOpen}
        onClose={() => setIsSaoOpen(false)}
        currentFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Interactive Map */}
      <div className="flex-1 w-full h-full relative z-10">
        <LeafletMap places={filteredPlaces} onSelectPlace={setSelectedPlace} />
      </div>

      {/* Request Hunt Floating Action Button */}
      <button
        onClick={() => router.push('/request')}
        className="absolute bottom-20 right-3.5 z-30 bg-bau-red text-white border-[2.5px] border-bau-black rounded-full py-2.5 px-4 font-baloo font-extrabold text-xs shadow-bau flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
      >
        <span>🎯</span>
        <span>Request Hunt</span>
      </button>

      {/* Bottom Sheet Place Preview */}
      {selectedPlace && (
        <>
          <div
            onClick={() => setSelectedPlace(null)}
            className="absolute inset-0 bg-black/50 z-40"
          />
          <div className="absolute left-0 right-0 bottom-0 bg-bau-cream border-t-[2.5px] border-bau-black rounded-t-3xl shadow-2xl p-4 pb-6 z-50">
            <div className="w-10 h-1 bg-bau-black rounded-full mx-auto mb-3" />
            <h3 className="font-baloo font-extrabold text-xl">{selectedPlace.name}</h3>
            <div className="flex gap-3 text-xs font-semibold text-gray-600 mt-1 mb-3">
              <span>📍 {selectedPlace.area || 'Klang Valley'}</span>
              <span>{selectedPlace.price_level || '💰💰'}</span>
            </div>
            <div className="bg-white border-[2.5px] border-bau-black rounded-xl p-3 text-xs italic text-gray-700 shadow-bau-sm mb-4">
              &quot;{selectedPlace.quote || 'No Hunter quote recorded yet.'}&quot;
            </div>
            <button
              onClick={() => router.push(`/places/${selectedPlace.id}`)}
              className="w-full bg-bau-black text-bau-cream border-[2.5px] border-bau-black py-3 rounded-xl font-baloo font-extrabold text-sm shadow-bau active:translate-x-0.5 active:translate-y-0.5"
            >
              View Full Details & Official Verdict
            </button>
          </div>
        </>
      )}
    </div>
  );
}
