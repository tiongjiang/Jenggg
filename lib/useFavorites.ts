'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load from device storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('jenggg_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse favorites');
      }
    }
  }, []);

  const toggleFavorite = (placeId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(placeId);
      const next = isFav ? prev.filter((id) => id !== placeId) : [...prev, placeId];
      localStorage.setItem('jenggg_favorites', JSON.stringify(next));
      return next;
    });
  };

  return { favorites, toggleFavorite };
}
