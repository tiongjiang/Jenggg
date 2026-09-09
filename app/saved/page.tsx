'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Place } from '@/lib/supabase';
import { useFavorites } from '@/lib/useFavorites';
import { RATING_TIERS } from '@/lib/ratings';

export default function SavedPlacesPage() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      if (favorites.length === 0) {
        setPlaces([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase.from('places').select('*').in('id', favorites);
      if (data) setPlaces(data as Place[]);
      setLoading(false);
    }
    fetchSaved();
  }, [favorites]);

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-hidden">
      <div className="bg-bau-blue text-white p-5 pt-[calc(env(safe-area-inset-top,44px)+16px)] border-b-[2.5px] border-bau-black shrink-0">
        <h2 className="font-baloo font-extrabold text-2xl">⭐ Saved Spots</h2>
        <p className="font-semibold text-xs text-blue-100 mt-0.5">Your personal hit-list.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {loading ? (
          <div className="text-center font-baloo font-bold text-sm text-gray-500 my-8">Loading your spots...</div>
        ) : places.length === 0 ? (
          <div className="text-center font-baloo font-bold text-sm text-gray-500 my-8">
            No saved spots yet. Go Hunt and tap the ⭐!
          </div>
        ) : (
          places.map((p) => {
            const safeTier = p.current_tier || 'mamadei';
            const badge = RATING_TIERS[safeTier];
            return (
              <div
                key={p.id}
                onClick={() => router.push(`/places/${p.id}`)}
                className="bg-white border-[2.5px] border-bau-black rounded-2xl p-3.5 flex items-center justify-between shadow-bau-sm cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                <div>
                  <div className="font-extrabold text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500 font-medium">{p.area} · {p.category}</div>
                </div>
                <div className={`${badge.colorClass.replace('text-', 'bg-').replace('500', '100')} border-[1.5px] border-bau-black font-baloo font-extrabold text-[11px] px-2.5 py-1 rounded-full text-bau-black`}>
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
