'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Place } from '@/lib/supabase';
import { RATING_TIERS } from '@/lib/ratings';

export default function RankingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data } = await supabase.from('places').select('*').eq('is_requested', false);
      
      if (data) {
        // TIER WEIGHTING FOR RANKING SORT (5 is highest)
        const tierWeights: Record<string, number> = { jengggg: 5, hociakk: 4, mamadei: 3, hmmm: 2, ewww: 1 };
        
        const sortedPlaces = (data as Place[]).sort((a, b) => {
          const weightA = tierWeights[a.current_tier || 'mamadei'] || 0;
          const weightB = tierWeights[b.current_tier || 'mamadei'] || 0;
          return weightB - weightA; // Sort by Rating Tier > Defaults
        });
        setPlaces(sortedPlaces);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const getFiltered = (categories: string[]) => places.filter(p => categories.some(c => p.category?.toLowerCase().includes(c)));

  const tabs = {
    restaurants: getFiltered(['restaurant', 'bbq', 'burger', 'cafe']),
    streetfood: getFiltered(['street', 'kandar', 'satay', 'kopitiam']),
    entertainment: getFiltered(['entertainment', 'arcade', 'vr']),
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-hidden">
      <div className="bg-bau-red text-white p-5 pt-[calc(env(safe-area-inset-top,44px)+16px)] border-b-[2.5px] border-bau-black shrink-0 relative">
        <button onClick={() => router.push('/')} className="absolute top-[calc(env(safe-area-inset-top,44px)+16px)] right-5 bg-white/20 p-2 rounded-xl text-xs font-bold border border-white/30">✕ Close</button>
        <h2 className="font-baloo font-extrabold text-2xl">🏆 Global Rankings</h2>
        <p className="font-semibold text-xs text-red-100 mt-0.5">Ranked by Tier &gt; Comments &gt; Favorites</p>

        <div className="grid grid-cols-3 gap-1.5 mt-4 bg-black/20 p-1.5 rounded-xl border border-white/20 text-[11px] font-baloo font-extrabold">
          <button onClick={() => setActiveTab('restaurants')} className={`py-1.5 rounded-lg ${activeTab === 'restaurants' ? 'bg-bau-yellow text-bau-black' : 'text-white'}`}>🍽️ Dining</button>
          <button onClick={() => setActiveTab('streetfood')} className={`py-1.5 rounded-lg ${activeTab === 'streetfood' ? 'bg-bau-yellow text-bau-black' : 'text-white'}`}>🍜 Street</button>
          <button onClick={() => setActiveTab('entertainment')} className={`py-1.5 rounded-lg ${activeTab === 'entertainment' ? 'bg-bau-yellow text-bau-black' : 'text-white'}`}>🎮 Fun</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {loading ? <div className="text-center text-sm font-bold my-8">Loading rankings...</div> : (
          tabs[activeTab as keyof typeof tabs].map((p, i) => {
            const badge = RATING_TIERS[p.current_tier || 'mamadei'];
            return (
              <div key={p.id} onClick={() => router.push(`/places/${p.id}`)} className="bg-white border-[2.5px] border-bau-black rounded-2xl p-3.5 flex items-center justify-between shadow-bau-sm cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-bau-black text-white font-baloo font-extrabold text-xs flex items-center justify-center border-[1.5px] border-bau-black">{i + 1}</div>
                  <div>
                    <div className="font-extrabold text-sm">{p.name}</div>
                    <div className="text-xs text-gray-500 font-medium">{p.area}</div>
                  </div>
                </div>
                <div className="bg-gray-100 border-[1.5px] border-bau-black font-baloo font-extrabold text-[11px] px-2.5 py-1 rounded-full text-bau-black">
                  {badge.emoji} {badge.label}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
