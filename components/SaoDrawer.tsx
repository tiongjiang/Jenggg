'use client';

import React from 'react';

interface SaoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const SaoDrawer: React.FC<SaoDrawerProps> = ({
  isOpen,
  onClose,
  currentFilter,
  onSelectFilter,
}) => {
  const ratingOptions = [
    { id: 'all', label: 'All Places', icon: '🌐' },
    { id: 'jengggg', label: '🔥 Jengggg Only', icon: '⭐' },
    { id: 'hociakk', label: '🤤 Hociakk Only', icon: '⭐' },
    { id: 'requested', label: '🎯 Requested Queue', icon: '🎯' },
  ];

  const categoryOptions = [
    { id: 'cat:street', label: '🍜 Street & Hawker', icon: '🥢' },
    { id: 'cat:restaurant', label: '🍽️ Restaurants & BBQ', icon: '🥩' },
    { id: 'cat:cafe', label: '☕ Kopitiam & Cafes', icon: '🧋' },
    { id: 'cat:entertainment', label: '🎮 Entertainment & Fun', icon: '🕹️' },
  ];

  return (
    <>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#0A0C14]/60 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`sao-clip-panel absolute top-0 bottom-0 right-0 w-[260px] bg-sao-dark border-l-2 border-sao-cyan shadow-sao z-50 p-5 pt-12 transition-transform duration-300 ease-out flex flex-col overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-sao-cyan/20 border border-sao-cyan text-sao-cyan flex items-center justify-center font-bold text-xs hover:bg-sao-cyan hover:text-bau-black transition-colors"
        >
          ✕
        </button>

        {/* Ratings Section */}
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-sao-cyan/30">
          <div className="w-2.5 h-2.5 bg-sao-cyan rotate-45 shadow-[0_0_8px_#56E2FF]" />
          <h3 className="font-space font-bold text-[11px] tracking-widest text-[#D6F6FF] uppercase">
            Rating Tiers
          </h3>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {ratingOptions.map((opt) => {
            const isActive = currentFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelectFilter(opt.id);
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sao-cyan/40 to-bau-blue/40 border-sao-cyan text-white shadow-sao'
                    : 'bg-sao-cyan/10 border-sao-cyan/20 text-[#E8F8FF] hover:border-sao-cyan/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
                {isActive && <span className="text-sao-cyan font-bold">●</span>}
              </button>
            );
          })}
        </div>

        {/* Categories Section */}
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-sao-cyan/30">
          <div className="w-2.5 h-2.5 bg-bau-yellow rotate-45 shadow-[0_0_8px_#FFCC00]" />
          <h3 className="font-space font-bold text-[11px] tracking-widest text-[#FFF2B2] uppercase">
            Categories
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          {categoryOptions.map((opt) => {
            const isActive = currentFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelectFilter(opt.id);
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-bau-yellow/30 to-bau-red/30 border-bau-yellow text-white shadow-sao'
                    : 'bg-white/5 border-white/10 text-[#E8F8FF] hover:border-white/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
                {isActive && <span className="text-bau-yellow font-bold">●</span>}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
