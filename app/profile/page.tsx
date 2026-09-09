'use client';

import React from 'react';
import { TrainerBoy } from '@/components/TrainerBoy';

export default function ProfilePage() {
  const badges = [
    { id: '1', name: 'Noodle Hunter', icon: '🍜', unlocked: true },
    { id: '2', name: 'Kopitiam Hero', icon: '☕', unlocked: true },
    { id: '3', name: 'Spicy Legend', icon: '🔥', unlocked: true },
    { id: '4', name: 'Night Hunter', icon: '🌙', unlocked: true },
    { id: '5', name: 'Hidden Gem', icon: '💎', unlocked: false },
    { id: '6', name: 'Veteran Scout', icon: '🏆', unlocked: false },
    { id: '7', name: 'Party Host', icon: '👥', unlocked: false },
    { id: '8', name: 'KL Gourmet', icon: '👑', unlocked: false },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-hidden">
      {/* Profile Header */}
      <div className="bg-bau-blue text-white p-6 pt-10 border-b-[2.5px] border-bau-black text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-bau-yellow border-[2.5px] border-bau-black shadow-bau flex items-center justify-center mb-3">
          <div className="scale-150">
            <TrainerBoy />
          </div>
        </div>
        <h2 className="font-baloo font-extrabold text-2xl leading-tight">Level 8 Hunter</h2>
        <div className="w-48 h-2 bg-black/25 rounded-full overflow-hidden border border-bau-black my-2">
          <div className="w-[82%] h-full bg-bau-yellow" />
        </div>
        <p className="text-xs font-semibold text-blue-100">820 / 1000 XP to Level 9</p>

        {/* Stats */}
        <div className="flex gap-4 mt-3">
          <div className="bg-white/15 border border-bau-black rounded-xl px-4 py-1.5 shadow-bau-sm">
            <div className="font-baloo font-extrabold text-base">24</div>
            <div className="text-[10px] font-semibold text-blue-100">Hunts</div>
          </div>
          <div className="bg-white/15 border border-bau-black rounded-xl px-4 py-1.5 shadow-bau-sm">
            <div className="font-baloo font-extrabold text-base">18</div>
            <div className="text-[10px] font-semibold text-blue-100">Places</div>
          </div>
          <div className="bg-white/15 border border-bau-black rounded-xl px-4 py-1.5 shadow-bau-sm">
            <div className="font-baloo font-extrabold text-base">6</div>
            <div className="text-[10px] font-semibold text-blue-100">Reviews</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="font-baloo font-extrabold text-xs uppercase tracking-wider text-bau-black mb-3">
          🏅 Hunter Badges
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`border-[2.5px] border-bau-black rounded-xl p-2.5 text-center shadow-bau-sm ${
                b.unlocked ? 'bg-white' : 'bg-gray-200 opacity-40'
              }`}
            >
              <div className="text-2xl mb-1">{b.icon}</div>
              <div className="font-baloo font-bold text-[10px] leading-tight text-bau-black">
                {b.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
