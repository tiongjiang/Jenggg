'use client';

import React, { useState } from 'react';

interface SaoMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: string;
  onSelectFilter: (filter: string) => void;
}

interface FilterCategory {
  id: string;
  title: string;
  icon: string;
  items: { id: string; label: string; icon: string }[];
}

export const SaoDrawer: React.FC<SaoMenuProps> = ({
  isOpen,
  onClose,
  currentFilter,
  onSelectFilter,
}) => {
  const [activeTab, setActiveTab] = useState<string>('tiers');

  const categories: FilterCategory[] = [
    {
      id: 'tiers',
      title: 'Rating Tiers',
      icon: '⭐',
      items: [
        { id: 'all', label: 'All Places', icon: '🌐' },
        { id: 'jengggg', label: 'Jengggg (5★)', icon: '🔥' },
        { id: 'hociakk', label: 'Hociakk (4★)', icon: '🤤' },
        { id: 'mamadei', label: 'Ma Ma Dei (3★)', icon: '😐' },
        { id: 'hmmm', label: 'Hmmm (2★)', icon: '🤨' },
      ],
    },
    {
      id: 'categories',
      title: 'Categories',
      icon: '🍜',
      items: [
        { id: 'cat:street', label: 'Street & Hawkers', icon: '🥢' },
        { id: 'cat:restaurant', label: 'Restaurants & BBQ', icon: '🥩' },
        { id: 'cat:cafe', label: 'Kopitiam & Cafes', icon: '☕' },
        { id: 'cat:entertainment', label: 'Entertainment & Fun', icon: '🎮' },
      ],
    },
    {
      id: 'hunts',
      title: 'Hunt Queue',
      icon: '🎯',
      items: [
        { id: 'requested', label: 'Most-Requested', icon: '🔥' },
        { id: 'all', label: 'Clear Filters', icon: '↺' },
      ],
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <>
      {/* Invisible backdrop to close when tapping outside */}
      {isOpen && (
        <div
          onClick={onClose}
          className="absolute inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity duration-300"
        />
      )}

      {/* Slide Down/Up Container positioned directly below the top-right menu trigger */}
      <div
        className={`absolute top-[calc(env(safe-area-inset-top,44px)+116px)] right-3.5 z-50 w-[210px] select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-3 pointer-events-none'
        }`}
      >
        {/* SAO Frosted Glass Dropdown Card */}
        <div className="bg-white/95 backdrop-blur-md border-[2.5px] border-bau-black rounded-2xl shadow-bau overflow-hidden p-3 flex flex-col gap-2.5">
          
          {/* Category Tabs: Rating (⭐), Category (🍜), Hunt (🎯) */}
          <div className="flex items-center justify-around bg-gray-100/90 p-1 rounded-xl border border-gray-300">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-[#FF9500] text-white shadow-[0_2px_8px_rgba(255,149,0,0.5)] scale-105'
                      : 'text-gray-600 hover:text-bau-black'
                  }`}
                  title={cat.title}
                >
                  {cat.icon}
                </button>
              );
            })}
          </div>

          {/* SAO Header Title */}
          <div className="flex items-center gap-1.5 px-1 pt-0.5 pb-1 border-b border-gray-200">
            <span className="w-2 h-2 bg-[#FF9500] rotate-45 inline-block shadow-[0_0_6px_#FF9500]" />
            <span className="font-space font-bold text-[10.5px] uppercase tracking-wider text-gray-700 truncate">
              {currentCategory.title}
            </span>
          </div>

          {/* Sub-items List with Diamond Bullets & Slide Animation */}
          <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto">
            {currentCategory.items.map((item) => {
              const isSelected = currentFilter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectFilter(item.id);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#FF9500] text-white shadow-[0_2px_8px_rgba(255,149,0,0.4)]'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`text-[9px] ${isSelected ? 'text-white' : 'text-gray-400'}`}>◆</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-sm shrink-0">{item.icon}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
