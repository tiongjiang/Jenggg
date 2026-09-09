'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { supabase, Place } from '@/lib/supabase';
import { TrainerBoy } from '@/components/TrainerBoy';
import { SaoDrawer } from '@/components/SaoDrawer';
import { useFavorites } from '@/lib/useFavorites';

const LeafletMap = dynamic(() => import('@/components/LeafletMapComponent'), { ssr: false });

export default function HomePage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isSaoOpen, setIsSaoOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Bring in favorites to support map filtering
  const { favorites } = useFavorites();

  useEffect(() => {
    async function loadPlaces() {
      const { data } = await supabase.from('places').select('*');
      if (data) setPlaces(data as Place[]);
    }
    loadPlaces();
  }, []);

  const filteredPlaces = places.filter((p) => {
    let matchesFilter = true;
    if (activeFilter === 'all') matchesFilter = true;
    else if (activeFilter === 'requested') matchesFilter = Boolean(p.is_requested);
    else if (activeFilter === 'saved') matchesFilter = favorites.includes(p.id); // 🔥 Saved Filter Logic
    else if (activeFilter.startsWith('cat:')) {
      const catKey = activeFilter.replace('cat:', '').toLowerCase();
      matchesFilter = p.category ? p.category.toLowerCase().includes(catKey) : false;
    } else {
      matchesFilter = p.current_tier === activeFilter;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (p.name && p.name.toLowerCase().includes(q)) || (p.area && p.area.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col relative h-full overflow-hidden">
      
      <div className="absolute top-[calc(env(safe-area-inset-top,44px)+8px)] left-3.5 right-3.5 z-30 flex items-center justify-between pointer-events-none">
        <div onClick={() => router.push('/profile')} className="pointer-events-auto flex items-center gap-2 bg-bau-cream border-[2.5px] border-bau-black shadow-bau-sm rounded-full py-1 px-3 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-bau-red border-2 border-bau-black flex items-center justify-center overflow-hidden"><TrainerBoy scale={0.75} /></div>
          <div>
            <div className="font-baloo font-extrabold text-xs leading-none">Lv.8 Hunter</div>
            <div className="w-10 h-1 bg-[#E0DAC8] rounded-full overflow-hidden border border-bau-black mt-1"><div className="w-3/4 h-full bg-bau-yellow" /></div>
          </div>
        </div>

        {/* 🏆 TOP RIGHT RANKINGS BUTTON */}
        <button 
          onClick={() => router.push('/rankings')}
          className="pointer-events-auto bg-bau-yellow border-[2.5px] border-bau-black rounded-full px-3 py-1 font-baloo font-extrabold text-xs shadow-bau-sm flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <span>🏆</span>
          <span>Rankings</span>
        </button>
      </div>

      <div className="absolute top-[calc(env(safe-area-inset-top,44px)+58px)] left-3.5 right-3.5 z-30">
        <div className="bg-bau-cream border-[2.5px] border-bau-black rounded-2xl p-2.5 flex items-center gap-2.5 shadow-bau">
          <div className="w-7 h-7 rounded-full bg-bau-yellow border-2 border-bau-black flex items-center justify-center text-xs shrink-0">🔍</div>
          <input type="text" placeholder="Search food, stalls, areas…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-none bg-transparent outline-none font-semibold text-xs text-bau-black flex-1" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="text-xs font-bold px-1">✕</button>}
        </div>
      </div>

      <button onClick={() => setIsSaoOpen(!isSaoOpen)} className={`absolute top-[calc(env(safe-area-inset-top,44px)+116px)] right-3.5 z-30 w-11 h-11 rounded-full border-[2.5px] border-bau-black flex items-center justify-center transition-all duration-200 active:scale-95 ${isSaoOpen ? 'bg-bau-yellow shadow-bau scale-105' : 'bg-bau-cream shadow-bau'}`}>
        <span className="text-lg font-space font-extrabold text-bau-black">{isSaoOpen ? '▲' : '⬡'}</span>
      </button>

      <SaoDrawer isOpen={isSaoOpen} onClose={() => setIsSaoOpen(false)} currentFilter={activeFilter} onSelectFilter={setActiveFilter} />

      <div className="flex-1 w-full h-full relative z-10">
        <LeafletMap places={filteredPlaces} />
      </div>

      <button onClick={() => router.push('/request')} className="absolute bottom-5 right-3.5 z-30 bg-bau-red text-white border-[2.5px] border-bau-black rounded-full py-2.5 px-4 font-baloo font-extrabold text-xs shadow-bau flex items-center gap-1.5 active:scale-95 transition-transform">
        <span>🎯</span><span>Request Hunt</span>
      </button>
    </div>
  );
}
