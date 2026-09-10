'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { Place } from '@/lib/supabase';
import { RATING_TIERS } from '@/lib/ratings';

interface MapProps {
  places: Place[];
}

// 🎯 Named constant for Level of Detail (LoD) threshold
export const ZOOM_LABEL_THRESHOLD = 15;

// Approximate pixel collision bounding box dimensions (width x height)
const LABEL_COLLISION_WIDTH = 160; 
const LABEL_COLLISION_HEIGHT = 48;

// Mapping to Tailwind theme.extend.colors.tier
const TIER_COLORS: Record<string, { body: string; accent: string; label: string; text: string }> = {
  jengggg: { body: '#FFCC00', accent: '#E5B800', label: '🔥 Jengggg', text: '#141416' },
  hociakk: { body: '#00B368', accent: '#008F53', label: '🤤 Hociakk', text: '#FFFFFF' },
  mamadei: { body: '#F4EEDC', accent: '#D8D2C0', label: '😐 Ma Ma Dei', text: '#141416' },
  hmmm:    { body: '#A0A4B8', accent: '#7E8296', label: '🤨 Hmmm', text: '#FFFFFF' },
  ewww:    { body: '#7B3294', accent: '#5A1F6E', label: '😖 Ewww', text: '#FFFFFF' },
};

/**
 * 👾 SVG Monster Creature Icon Generator
 */
function getMonsterSvg(color: string, accent: string) {
  return `
    <svg viewBox="0 0 40 40" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Horns / Ears -->
      <path d="M10 14L5 4L16 9" fill="${accent}" stroke="#141416" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M30 14L35 4L24 9" fill="${accent}" stroke="#141416" stroke-width="2.5" stroke-linejoin="round"/>
      
      <!-- Monster Body (Chubby geometric shape) -->
      <rect x="5" y="9" width="30" height="27" rx="13" fill="${color}" stroke="#141416" stroke-width="2.5"/>
      
      <!-- Belly Accent Plate -->
      <path d="M12 26C12 22 15 20 20 20C25 20 28 22 28 26C28 30 25 33 20 33C15 33 12 30 12 26Z" fill="${accent}" opacity="0.45"/>
      
      <!-- Eyes -->
      <circle cx="14" cy="18" r="4.5" fill="#FFFFFF" stroke="#141416" stroke-width="2"/>
      <circle cx="26" cy="18" r="4.5" fill="#FFFFFF" stroke="#141416" stroke-width="2"/>
      <circle cx="15.5" cy="17.5" r="2" fill="#141416"/>
      <circle cx="24.5" cy="17.5" r="2" fill="#141416"/>
      <circle cx="16.5" cy="16.5" r="0.75" fill="#FFFFFF"/>
      <circle cx="25.5" cy="16.5" r="0.75" fill="#FFFFFF"/>
      
      <!-- Cute Fanged Smile -->
      <path d="M16 25C18 27 22 27 24 25" stroke="#141416" stroke-width="2" stroke-linecap="round"/>
      <polygon points="17,25 18,27 19,25" fill="#FFFFFF"/>
      <polygon points="21,25 22,27 23,25" fill="#FFFFFF"/>
    </svg>
  `;
}

/**
 * Creates Leaflet divIcon with LoD classes and collision badges
 */
function createMonsterIcon(group: Place[], isZoomedIn: boolean) {
  const primary = group[0];
  const isCluster = group.length > 1;
  const safeTier = primary.current_tier || 'mamadei';
  const tierData = TIER_COLORS[safeTier] || TIER_COLORS.mamadei;
  
  const monsterSvg = getMonsterSvg(
    primary.is_requested ? '#FFFFFF' : tierData.body,
    primary.is_requested ? '#D1D5DB' : tierData.accent
  );

  const clusterCountBadge = isCluster 
    ? `<div class="monster-collision-count">${group.length}</div>`
    : '';

  const labelText = isCluster
    ? `${group.length} Places (Hawker Hub)`
    : primary.name;

  const tierBadge = isCluster
    ? `<span style="background:#141416; color:#FFFDF7; padding: 2px 6px; border-radius: 4px; font-size: 9px;">Tap to view</span>`
    : `<span style="background:${tierData.body}; color:${tierData.text}; padding: 2px 6px; border-radius: 4px; border: 1.5px solid #141416;">${primary.is_requested ? '🎯 Requested' : tierData.label}</span>`;

  return L.divIcon({
    className: 'monster-marker-container',
    html: `
      <div class="monster-marker-wrapper ${isZoomedIn ? 'zoom-expanded' : ''}">
        <div class="monster-icon-box">
          ${monsterSvg}
          ${clusterCountBadge}
        </div>
        <div class="monster-label-pill">
          <div style="background:#FFFDF7; border: 2px solid #141416; border-radius: 10px; padding: 3px 8px; box-shadow: 2px 2px 0px #141416; display: flex; align-items: center; gap: 6px;">
            <span style="font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 11px; color: #141416; max-width: 110px; overflow: hidden; text-overflow: ellipsis;">
              ${labelText}
            </span>
            ${tierBadge}
          </div>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -28],
  });
}

function createUserTrainerIcon() {
  return L.divIcon({
    className: 'user-trainer-marker',
    html: `
      <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:-10px;border-radius:50%;background:rgba(255,204,0,0.3);animation:pulse 2s infinite;"></div>
        <div style="position:absolute;bottom:2px;width:24px;height:7px;border-radius:50%;background:rgba(0,0,0,0.45);filter:blur(1px);"></div>
        <div style="position:relative;z-index:2;transform:scale(1.2);">
          <svg viewBox="0 0 16 18" width="24" height="28" shape-rendering="crispEdges">
            <rect x="4" y="1" width="8" height="4" fill="#FF3B30" />
            <rect x="3" y="4" width="11" height="2" fill="#FF3B30" />
            <rect x="2" y="5" width="4" height="1" fill="#FFFFFF" />
            <rect x="6" y="3" width="3" height="2" fill="#FFFFFF" />
            <rect x="4" y="5" width="8" height="2" fill="#201C1B" />
            <rect x="2" y="6" width="3" height="4" fill="#201C1B" />
            <rect x="11" y="6" width="3" height="4" fill="#201C1B" />
            <rect x="5" y="6" width="6" height="5" fill="#FFDFC4" />
            <rect x="6" y="8" width="1" height="2" fill="#141416" />
            <rect x="9" y="8" width="1" height="2" fill="#141416" />
            <rect x="4" y="11" width="8" height="4" fill="#2251FF" />
            <rect x="6" y="11" width="4" height="4" fill="#FF3B30" />
            <rect x="6" y="11" width="4" height="1" fill="#FFFFFF" />
            <rect x="5" y="15" width="6" height="2" fill="#3D405B" />
            <rect x="4" y="17" width="3" height="1" fill="#FF3B30" />
            <rect x="9" y="17" width="3" height="1" fill="#FF3B30" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 38],
    popupAnchor: [0, -45],
  });
}

function getFallbackImage(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes('nasi') || cat.includes('kandar') || cat.includes('street')) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
  if (cat.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
  if (cat.includes('bbq') || cat.includes('mookata')) return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80';
  if (cat.includes('satay')) return 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=600&q=80';
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
}

/**
 * Tracks Zoom Level for LoD & handles Map Ready events
 */
function MapEventsWatcher({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend() {
      onZoomChange(map.getZoom());
    },
  });
  return null;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14, { animate: true });
    setTimeout(() => map.invalidateSize(), 300);
  }, [center, map]);
  return null;
}

export default function LeafletMapComponent({ places }: MapProps) {
  const router = useRouter();
  const [userPos, setUserPos] = useState<[number, number]>([3.1292, 101.6784]);
  const [currentZoom, setCurrentZoom] = useState<number>(14);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('GPS default to KL:', err.message),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  function locateMe() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      });
    } else {
      alert('GPS Geolocation not supported by this browser.');
    }
  }

  const isZoomedIn = currentZoom >= ZOOM_LABEL_THRESHOLD;

  /**
   * 4. Bounding-Box Collision Detection (Active ONLY when labels are visible)
   */
  const groupedPlaceMarkers = useMemo(() => {
    if (!isZoomedIn) {
      // Zoomed out: Free overlapping monster icons
      return places.map((p) => ({
        key: p.id,
        lat: Number(p.lat),
        lng: Number(p.lng),
        items: [p],
      }));
    }

    // Zoomed in: Cluster close labels together using simple coordinate proximity
    const clusters: { key: string; lat: number; lng: number; items: Place[] }[] = [];
    // Approximate coordinate tolerance corresponding to label width/height at zoom 15+
    const LAT_PROXIMITY = 0.0007;
    const LNG_PROXIMITY = 0.0007;

    places.forEach((place) => {
      const pLat = Number(place.lat);
      const pLng = Number(place.lng);

      const existingCluster = clusters.find(
        (c) => Math.abs(c.lat - pLat) < LAT_PROXIMITY && Math.abs(c.lng - pLng) < LNG_PROXIMITY
      );

      if (existingCluster) {
        existingCluster.items.push(place);
      } else {
        clusters.push({
          key: place.id,
          lat: pLat,
          lng: pLng,
          items: [place],
        });
      }
    });

    return clusters;
  }, [places, isZoomedIn]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <MapContainer
        center={userPos}
        zoom={14}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" maxZoom={19} />
        <MapEventsWatcher onZoomChange={setCurrentZoom} />
        <MapController center={userPos} />

        {/* 👤 Live User GPS Trainer Marker */}
        <Marker position={userPos} icon={createUserTrainerIcon()}>
          <Popup className="bauhaus-leaflet-popup font-baloo font-bold" closeButton={false}>
            <div className="bg-bau-black text-bau-yellow border-2 border-bau-yellow rounded-xl px-3 py-1.5 shadow-bau text-xs text-center">
              📍 You are here!
            </div>
          </Popup>
        </Marker>

        {/* 👾 Tier-Colored Monster Markers with LoD */}
        {groupedPlaceMarkers.map((group) => {
          const isCluster = group.items.length > 1;
          const firstPlace = group.items[0];

          return (
            <Marker
              key={group.key}
              position={[group.lat, group.lng]}
              icon={createMonsterIcon(group.items, isZoomedIn)}
            >
              {/* 3. Tap-to-Expand override: Opens popup detail card at any zoom */}
              <Popup className="bauhaus-leaflet-popup" closeButton={false}>
                {isCluster ? (
                  /* Multi-Place Hawker Cluster Card */
                  <div className="w-[240px] bg-bau-cream border-[2.5px] border-bau-black rounded-2xl p-3 shadow-bau select-none">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-bau-black">
                      <div className="font-baloo font-extrabold text-sm text-bau-black">
                        🍽️ Hawker Hub ({group.items.length})
                      </div>
                      <span className="text-[10px] bg-bau-yellow border border-bau-black font-extrabold px-1.5 py-0.5 rounded">
                        Co-located
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 max-h-[190px] overflow-y-auto">
                      {group.items.map((item) => {
                        const safeTier = item.current_tier || 'mamadei';
                        const badge = RATING_TIERS[safeTier] || RATING_TIERS.mamadei;
                        return (
                          <div
                            key={item.id}
                            onClick={() => router.push(`/places/${item.id}`)}
                            className="bg-white border-[1.5px] border-bau-black rounded-xl p-2 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
                          >
                            <div className="truncate pr-2">
                              <div className="font-baloo font-extrabold text-xs text-bau-black truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-gray-500 font-semibold truncate">
                                {item.category}
                              </div>
                            </div>
                            <span className="text-xs shrink-0">
                              {item.is_requested ? '🎯' : badge.emoji}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Single Place Standard Card */
                  <div className="w-[230px] bg-bau-cream border-[2.5px] border-bau-black rounded-2xl overflow-hidden shadow-bau select-none">
                    <div className="h-24 w-full relative overflow-hidden bg-gray-950 border-b-2 border-bau-black">
                      <img
                        src={getFallbackImage(firstPlace.category || '')}
                        alt={firstPlace.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-bau-cream border-[1.5px] border-bau-black rounded-full px-2 py-0.5 font-baloo font-extrabold text-[10px] shadow-bau-sm text-bau-black">
                        {firstPlace.price_level || '💰💰'}
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="font-baloo font-extrabold text-sm leading-tight text-bau-black truncate">
                        {firstPlace.name}
                      </h3>
                      <div className="text-[10px] text-gray-500 font-semibold truncate mb-2">
                        {firstPlace.category}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        <div className="bg-[#191B28] text-white p-1.5 rounded-lg border border-bau-black">
                          <span className="block text-[8px] font-space tracking-wider uppercase text-bau-yellow font-bold">
                            Official
                          </span>
                          <span className="font-baloo font-extrabold text-[11px] truncate block">
                            {firstPlace.is_requested
                              ? '🎯 Requested'
                              : RATING_TIERS[firstPlace.current_tier || 'mamadei']?.label}
                          </span>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-bau-black text-bau-black">
                          <span className="block text-[8px] font-space tracking-wider text-gray-500 font-bold uppercase">
                            Hunters
                          </span>
                          <span className="font-baloo font-extrabold text-[11px] block text-bau-red">
                            ★ 4.8
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push(`/places/${firstPlace.id}`)}
                        className="w-full bg-bau-black text-bau-cream border-[2px] border-bau-black py-2 rounded-xl font-baloo font-extrabold text-xs shadow-bau-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                      >
                        View Full Verdict →
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating GPS Recenter Button */}
      <button
        type="button"
        onClick={locateMe}
        className="absolute bottom-5 left-3.5 z-[1000] w-11 h-11 rounded-full bg-bau-cream text-bau-black border-[2.5px] border-bau-black shadow-bau flex items-center justify-center text-lg active:translate-x-0.5 active:translate-y-0.5 transition-transform"
        title="Recenter GPS"
      >
        📍
      </button>
    </div>
  );
}
