'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, HuntRequest } from '@/lib/supabase';
import { BottomNav } from '@/components/BottomNav';

export default function HuntPage() {
  const router = useRouter();
  const [hunts, setHunts] = useState<HuntRequest[]>([]);

  useEffect(() => {
    async function loadHunts() {
      const { data, error } = await supabase
        .from('hunt_requests')
        .select('*')
        .order('hunt_count', { ascending: false });
      if (!error && data) setHunts(data as HuntRequest[]);
    }
    loadHunts();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-hidden">
      {/* Header */}
      <div className="bg-bau-red text-white p-6 pt-10 border-b-[2.5px] border-bau-black">
        <h2 className="font-baloo font-extrabold text-2xl">🎯 Most-Requested Hunts</h2>
        <p className="font-semibold text-xs text-red-100 mt-1">
          Where the crowd wants the Food Hunter to strike next
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
        <div className="font-baloo font-extrabold text-xs uppercase tracking-wider text-bau-black mb-1">
          🔥 Top Community Leaderboard
        </div>

        {hunts.map((h, i) => (
          <div
            key={h.id}
            className="bg-white border-[2.5px] border-bau-black rounded-2xl p-3.5 flex items-center justify-between shadow-bau-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full border-[1.5px] border-bau-black font-baloo font-extrabold text-xs flex items-center justify-center text-white ${
                  i === 0 ? 'bg-bau-blue' : i === 1 ? 'bg-bau-red' : 'bg-bau-yellow text-bau-black'
                }`}
              >
                {i + 1}
              </div>
              <div>
                <div className="font-extrabold text-sm">{h.name}</div>
                <div className="text-xs text-gray-500 font-medium">
                  {h.area} · {h.category}
                </div>
              </div>
            </div>
            <div className="bg-bau-dim border-[1.5px] border-bau-black font-baloo font-extrabold text-xs px-2.5 py-1 rounded-full">
              {h.hunt_count} Hunts
            </div>
          </div>
        ))}

        <button
          onClick={() => router.push('/request')}
          className="mt-4 bg-bau-black text-white font-baloo font-extrabold text-sm py-3 rounded-xl border-[2.5px] border-bau-black shadow-bau active:translate-x-0.5 active:translate-y-0.5"
        >
          + Request a New Spot
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
