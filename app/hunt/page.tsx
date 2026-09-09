'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Place, HuntRequest } from '@/lib/supabase';

type RankingTab = 'restaurants' | 'streetfood' | 'entertainment' | 'requested';

export default function HuntAndRankingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RankingTab>('restaurants');
  const [places, setPlaces] = useState<Place[]>([]);
  const [hunts, setHunts] = useState<HuntRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { data: pData } = await supabase.from('places').select('*').eq('is_requested', false);
        if (pData) setPlaces(pData as Place[]);

        const { data: hData } = await supabase.from('hunt_requests').select('*').order('hunt_count', { ascending: false });
        if (hData) setHunts(hData as HuntRequest[]);
      } catch (err) {
        console.error('Error fetching rankings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const topRestaurants = places.filter(
    (p) =>
      p.category.toLowerCase().includes('restaurant') ||
      p.category.toLowerCase().includes('bbq') ||
      p.category.toLowerCase().includes('burger') ||
      p.category.toLowerCase().includes('cafe')
  );

  const topStreetFood = places.filter(
    (p) =>
      p.category.toLowerCase().includes('street') ||
      p.category.toLowerCase().includes('kandar') ||
      p.category.toLowerCase().includes('satay') ||
      p.category.toLowerCase().includes('kopitiam')
  );

  const topEntertainment = places.filter(
    (p) =>
      p.category.toLowerCase().includes('entertainment') ||
      p.category.toLowerCase().includes('arcade') ||
      p.category.toLowerCase().includes('vr')
  );

  function getTierBadge(tier: string | null) {
    if (tier === 'jengggg') return { label: '🔥 Jengggg', bg: 'bg-bau-yellow text-bau-black' };
    if (tier === 'hociakk') return { label: '🤤 Hociakk', bg: 'bg-bau-green text-white' };
    if (tier === 'mamadei') return { label: '😐 Ma Ma Dei', bg: 'bg-bau-dim text-bau-black' };
    return { label: '🤨 Hmmm', bg: 'bg-gray-300 text-bau-black' };
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-hidden">
      {/* Dynamic Notch Safe Header Padding */}
      <div className="bg-bau-red text-white p-5 pt-[calc(env(safe-area-inset-top,44px)+16px)] border-b-[2.5px] border-bau-black shrink-0">
        <h2 className="font-baloo font-extrabold text-2xl">🏆 Food & Fun Rankings</h2>
        <p className="font-semibold text-xs text-red-100 mt-0.5">
          Verified Malaysian spots & community requests
        </p>

        <div className="grid grid-cols-4 gap-1.5 mt-4 bg-black/20 p-1.5 rounded-xl border border-white/20 text-[11px] font-baloo font-extrabold">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`py-1.5 rounded-lg transition-all ${activeTab === 'restaurants' ? 'bg-bau-yellow text-bau-black' : 'text-white'}`}
          >
            🍽️ Dining
          </button>
          <button
            onClick={() => setActiveTab('streetfood')}
            className={`py-1.5 rounded-lg transition-all ${activeTab === 'streetfood' ? 'bg-bau-yellow text-bau-black' : 'text-white'}`}
          >
            🍜 Street
          </button>
          <button
            onClick={() => setActiveTab('entertainment')}
            className={`py-1.5 rounded-lg transition-all ${activeTab === 'entertainment' ? 'bg-bau-yellow text-bau-black' : 'text-white'}`}
          >
            🎮 Fun
          </button>
          <button
            onClick={() => setActiveTab('requested')}
            className={`py-1.5 rounded-lg transition-all ${activeTab === 'requested' ? 'bg-bau-yellow text-bau-black' : 'text-white'}`}
          >
            🎯 Hunts
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {loading ? (
          <div className="text-center font-baloo font-bold text-sm text-gray-500 my-8">
            ⚡ Loading rankings...
          </div>
        ) : (
          <>
            {activeTab === 'restaurants' && (
              <div>
                <div className="font-baloo font-extrabold text-xs uppercase tracking-wider text-bau-black mb-2 flex items-center justify-between">
                  <span>Top Rated Restaurants</span>
                  <span className="text-[10px] text-gray-500 font-inter">{topRestaurants.length} places</span>
                </div>
                {topRestaurants.map((p, i) => {
                  const badge = getTierBadge(p.current_tier);
                  return (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/places/${p.id}`)}
                      className="bg-white border-[2.5px] border-bau-black rounded-2xl p-3.5 mb-2.5 flex items-center justify-between shadow-bau-sm cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-bau-blue text-white font-baloo font-extrabold text-xs flex items-center justify-center border-[1.5px] border-bau-black">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{p.area} · {p.price_level}</div>
                        </div>
                      </div>
                      <div className={`${badge.bg} border-[1.5px] border-bau-black font-baloo font-extrabold text-[11px] px-2.5 py-1 rounded-full`}>
                        {badge.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'streetfood' && (
              <div>
                <div className="font-baloo font-extrabold text-xs uppercase tracking-wider text-bau-black mb-2 flex items-center justify-between">
                  <span>Street Food Champions</span>
                  <span className="text-[10px] text-gray-500 font-inter">{topStreetFood.length} places</span>
                </div>
                {topStreetFood.map((p, i) => {
                  const badge = getTierBadge(p.current_tier);
                  return (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/places/${p.id}`)}
                      className="bg-white border-[2.5px] border-bau-black rounded-2xl p-3.5 mb-2.5 flex items-center justify-between shadow-bau-sm cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-bau-red text-white font-baloo font-extrabold text-xs flex items-center justify-center border-[1.5px] border-bau-black">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">{p.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{p.area} · {p.category}</div>
                        </div>
                      </div>
                      <div className={`${badge.bg} border-[1.5px] border-bau-black font-baloo font-extrabold text-[11px] px-2.5 py-1 rounded-full`}>
                        {badge.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'entertainment' && (
              <div>
                <div className="font-baloo font-extrabold text-xs uppercase tracking-wider text-bau-black mb-2 flex items-center justify-between">
                  <span>Recreation Hubs</span>
                  <span className="text-[10px] text-gray-500 font-inter">{topEntertainment.length} places</span>
                </div>
                {topEntertainment.map((p, i) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/places/${p.id}`)}
                    className="bg-white border-[2.5px] border-bau-black rounded-2xl p-3.5 mb-2.5 flex items-center justify-between shadow-bau-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-bau-yellow text-bau-black font-baloo font-extrabold text-xs flex items-center justify-center border-[1.5px] border-bau-black">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm">{p.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{p.area} · {p.category}</div>
                      </div>
                    </div>
                    <div className="bg-bau-blue text-white border-[1.5px] border-bau-black font-baloo font-extrabold text-[11px] px-2.5 py-1 rounded-full">
                      🎮 Play
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'requested' && (
              <div>
                <div className="font-baloo font-extrabold text-xs uppercase tracking-wider text-bau-black mb-2 flex items-center justify-between">
                  <span>Community Hunt Queue</span>
                  <span className="text-[10px] text-gray-500 font-inter">{hunts.length} requests</span>
                </div>
                {hunts.map((h, i) => (
                  <div
                    key={h.id}
                    className="bg-white border-[2.5px] border-bau-black rounded-2xl p-3.5 mb-2.5 flex items-center justify-between shadow-bau-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-bau-black text-white font-baloo font-extrabold text-xs flex items-center justify-center border-[1.5px] border-bau-black">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm">{h.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{h.area} · {h.category}</div>
                      </div>
                    </div>
                    <div className="bg-bau-dim border-[1.5px] border-bau-black font-baloo font-extrabold text-xs px-2.5 py-1 rounded-full">
                      {h.hunt_count} Hunts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <button
          onClick={() => router.push('/request')}
          className="mt-2 bg-bau-black text-white font-baloo font-extrabold text-sm py-3.5 rounded-xl border-[2.5px] border-bau-black shadow-bau active:translate-x-0.5 active:translate-y-0.5"
        >
          + Request a Place for Review
        </button>
      </div>
    </div>
  );
}
