'use client';

import React, { useState } from 'react';

interface SaoMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: string;
  onSelectFilter: (filter: string) => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  subItems: { id: string; label: string; icon: string }[];
}

export const SaoDrawer: React.FC<SaoMenuProps> = ({
  isOpen,
  onClose,
  currentFilter,
  onSelectFilter,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('tiers');

  const menuData: MenuItem[] = [
    {
      id: 'tiers',
      title: 'Rating Tiers',
      icon: '⭐',
      subItems: [
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
      subItems: [
        { id: 'cat:street', label: 'Street & Hawkers', icon: '🥢' },
        { id: 'cat:restaurant', label: 'Restaurants & BBQ', icon: '🥩' },
        { id: 'cat:cafe', label: 'Kopitiam & Cafes', icon: '☕' },
        { id: 'cat:entertainment', label: 'Entertainment & Fun', icon: '🎮' },
      ],
    },
    {
      id: 'hunts',
      title: 'Hunt Bounties',
      icon: '🎯',
      subItems: [
        { id: 'requested', label: 'Most-Requested Queue', icon: '🔥' },
        { id: 'all', label: 'Clear Filters', icon: '↺' },
      ],
    },
  ];

  const currentCategoryData = menuData.find((m) => m.id === activeCategory);

  if (!isOpen) return null;

  return (
    <>
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-50 transition-opacity duration-300"
      />

      {/* SAO Floating Menu with Spring Slide-in Animation */}
      <div className="absolute top-[140px] right-3 z-50 flex items-start gap-3 select-none pointer-events-auto">
        {/* Horizontal Submenu Panel */}
        {currentCategoryData && (
          <div className="bg-white/95 backdrop-blur-md border-[2px] border-[#D1D5DB] rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.35)] p-3 w-[190px] animate-in fade-in slide-in-from-right-5 duration-200 ease-out">
            <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-gray-200">
              <span className="w-2 h-2 bg-[#FF9500] rotate-45 inline-block shadow-[0_0_6px_#FF9500]" />
              <span className="font-space font-bold text-[11px] uppercase tracking-wider text-gray-700">
                {currentCategoryData.title}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {currentCategoryData.subItems.map((sub) => {
                const isSelected = currentFilter === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      onSelectFilter(sub.id);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#FF9500] text-white shadow-[0_2px_8px_rgba(255,149,0,0.45)]'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] text-gray-400">◆</span>
                      <span className="truncate">{sub.label}</span>
                    </div>
                    <span className="text-sm shrink-0">{sub.icon}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Vertical Column of Metallic Floating Nodes */}
        <div className="flex flex-col gap-3 items-center animate-in fade-in slide-in-from-right-3 duration-200">
          {menuData.map((menu) => {
            const isActive = activeCategory === menu.id;
            return (
              <button
                key={menu.id}
                type="button"
                onClick={() => setActiveCategory(menu.id)}
                className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all duration-200 relative ${
                  isActive
                    ? 'scale-110 shadow-[0_0_16px_#FF9500] border-[2.5px] border-[#FF9500] bg-white'
                    : 'bg-gradient-to-b from-[#FFFFFF] to-[#D8DCE3] border-[2px] border-[#9CA3AF] shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95'
                }`}
              >
                <div
                  className={`w-[36px] h-[36px] rounded-full flex items-center justify-center ${
                    isActive ? 'bg-[#FFF3E0]' : 'bg-[#E5E7EB]'
                  }`}
                >
                  <span className="text-xl">{menu.icon}</span>
                </div>

                {isActive && (
                  <div className="absolute -left-1.5 w-2 h-2 rounded-full bg-[#FF9500] shadow-[0_0_6px_#FF9500]" />
                )}
              </button>
            );
          })}

          {/* Close Circular Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-[36px] h-[36px] rounded-full bg-[#1F2937] border-2 border-[#4B5563] text-gray-300 flex items-center justify-center font-bold text-xs shadow-md active:scale-95 hover:bg-red-600 hover:border-red-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
};
