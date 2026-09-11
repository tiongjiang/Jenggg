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

export const ZOOM_LABEL_THRESHOLD = 15;

const TIER_METRICS: Record<
  string,
  { fill: string; accent: string; icon: string; label: string }
> = {
  jengggg: { fill: '#FFCC00', accent: '#E5A700', icon: '🔥', label: 'Jengggg' },
  hociakk: { fill: '#00B368', accent: '#00854E', icon: '🤤', label: 'Hociakk' },
  mamadei: { fill: '#F4EEDC', accent: '#D1C6A9', icon: '😐', label: 'Ma Ma Dei' },
  hmmm:    { fill: '#A0A4B8', accent: '#7A7E94', icon: '🤨', label: 'Hmmm' },
  ewww:    { fill: '#7B3294', accent: '#501C63', icon: '😖', label: 'Ewww' },
};

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getChibiPixelFoodSvg(seedStr: string, category: string, tierColor: string, accentColor: string) {
  const seed = hashString(seedStr || 'food');
  const cat = (category || '').toLowerCase();

  let foodType = seed % 5;
  if (cat.includes('nasi') || cat.includes('kandar') || cat.includes('rice') || cat.includes('street')) {
    foodType = 0;
  } else if (cat.includes('burger') || cat.includes('western')) {
    foodType = 1;
  } else if (cat.includes('satay') || cat.includes('bbq') || cat.includes('mookata')) {
    foodType = 2;
  } else if (cat.includes('cafe') || cat.includes('coffee') || cat.includes('kopitiam') || cat.includes('boba')) {
    foodType = 3;
  } else if (cat.includes('dim sum') || cat.includes('dumpling') || cat.includes('snack')) {
    foodType = 4;
  }

  if (foodType === 0) {
    return `
      <svg viewBox="0 0 32 32" width="38" height="38" shape-rendering="crispEdges">
        <rect x="9" y="4" width="2" height="3" fill="#FFFFFF" opacity="0.8"/>
        <rect x="15" y="2" width="2" height="4" fill="#FFFFFF" opacity="0.8"/>
        <rect x="21" y="4" width="2" height="3" fill="#FFFFFF" opacity="0.8"/>
        <line x1="20" y1="5" x2="28" y2="13" stroke="#8B5A2B" stroke-width="1.8"/>
        <rect x="7" y="11" width="18" height="4" fill="${accentColor}"/>
        <rect x="13" y="10" width="6" height="2" fill="#FF3B30"/>
        <rect x="5" y="14" width="22" height="10" rx="3" fill="${tierColor}" stroke="#141416" stroke-width="1.8"/>
        <rect x="9" y="24" width="14" height="2" fill="#141416"/>
        <rect x="10" y="17" width="2" height="3" fill="#141416"/>
        <rect x="20" y="17" width="2" height="3" fill="#141416"/>
        <rect x="14" y="20" width="4" height="1.5" fill="#141416"/>
        <rect x="8" y="19" width="2" height="1" fill="#FF3B30"/>
        <rect x="22" y="19" width="2" height="1" fill="#FF3B30"/>
      </svg>
    `;
  }

  if (foodType === 1) {
    return `
      <svg viewBox="0 0 32 32" width="38" height="38" shape-rendering="crispEdges">
        <rect x="6" y="8" width="20" height="7" rx="3" fill="${tierColor}" stroke="#141416" stroke-width="1.8"/>
        <rect x="10" y="10" width="2" height="1" fill="#FFFFFF"/>
        <rect x="16" y="9" width="2" height="1" fill="#FFFFFF"/>
        <rect x="20" y="11" width="2" height="1" fill="#FFFFFF"/>
        <rect x="5" y="15" width="22" height="2" fill="#00B368"/>
        <rect x="7" y="17" width="18" height="2" fill="#FF3B30"/>
        <rect x="5" y="19" width="22" height="4" rx="1" fill="#5C3317" stroke="#141416" stroke-width="1.5"/>
        <rect x="6" y="23" width="20" height="4" rx="2" fill="${tierColor}" stroke="#141416" stroke-width="1.8"/>
        <rect x="11" y="11" width="2" height="2" fill="#141416"/>
        <rect x="19" y="11" width="2" height="2" fill="#141416"/>
        <rect x="14" y="13" width="4" height="1" fill="#141416"/>
      </svg>
    `;
  }

  if (foodType === 2) {
    return `
      <svg viewBox="0 0 32 32" width="38" height="38" shape-rendering="crispEdges">
        <line x1="8" y1="28" x2="24" y2="4" stroke="#D2B48C" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="17" y="5" width="8" height="6" rx="2" fill="${tierColor}" stroke="#141416" stroke-width="1.5"/>
        <rect x="13" y="11" width="8" height="6" rx="2" fill="${accentColor}" stroke="#141416" stroke-width="1.5"/>
        <rect x="9" y="17" width="8" height="6" rx="2" fill="${tierColor}" stroke="#141416" stroke-width="1.5"/>
        <rect x="15" y="13" width="1.5" height="1.5" fill="#141416"/>
        <rect x="19" y="13" width="1.5" height="1.5" fill="#141416"/>
        <rect x="17" y="15" width="2" height="1" fill="#141416"/>
        <circle cx="23" cy="23" r="3" fill="#FFCC00" stroke="#141416" stroke-width="1"/>
      </svg>
    `;
  }

  if (foodType === 3) {
    return `
      <svg viewBox="0 0 32 32" width="38" height="38" shape-rendering="crispEdges">
        <line x1="17" y1="3" x2="20" y2="12" stroke="#FF3B30" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="7" y="10" width="18" height="3" rx="1.5" fill="#141416"/>
        <path d="M8 13L10 27H22L24 13Z" fill="${tierColor}" stroke="#141416" stroke-width="1.8"/>
        <circle cx="12" cy="24" r="1.5" fill="#141416"/>
        <circle cx="16" cy="25" r="1.5" fill="#141416"/>
        <circle cx="20" cy="24" r="1.5" fill="#141416"/>
        <rect x="12" y="16" width="2" height="2" fill="#141416"/>
        <rect x="18" y="16" width="2" height="2" fill="#141416"/>
        <rect x="15" y="18" width="2" height="1" fill="#141416"/>
        <rect x="10" y="18" width="1.5" height="1" fill="#FF3B30"/>
        <rect x="20" y="18" width="1.5" height="1" fill="#FF3B30"/>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 32 32" width="38" height="38" shape-rendering="crispEdges">
      <ellipse cx="16" cy="26" rx="12" ry="3.5" fill="#D2B48C" stroke="#141416" stroke-width="1.5"/>
      <path d="M8 23C7 16 11 11 16 10C21 11 25 16 24 23C22 25 10 25 8 23Z" fill="${tierColor}" stroke="#141416" stroke-width="1.8"/>
      <path d="M14 10C16 8 16 8 18 10" stroke="#141416" stroke-width="1.5" stroke-linecap="round"/>
      <rect x="12" y="16" width="2" height="2" fill="#141416"/>
      <rect x="18" y="16" width="2" height="2" fill="#141416"/>
      <rect x="14" y="19" width="4" height="1.5" rx="0.5" fill="#141416"/>
      <rect x="10" y="18" width="1.5" height="1" fill="#FF3B30"/>
      <rect x="20" y="18" width="1.5" height="1" fill="#FF3B30"/>
    </svg>
  `;
}

function getInlineTierIconBadge(safeTier: string, isRequested: boolean, isCluster: boolean) {
  if (isCluster) {
    return `
      <span style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #141416;
        color: #FFFDF7;
        font-size: 10px;
        flex-shrink: 0;
      ">👥</span>
    `;
  }

  if (isRequested) {
    return `
      <span style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #FF3B30;
        border: 1.5px solid #141416;
        color: #FFFFFF;
        font-size: 10px;
        flex-shrink: 0;
      ">🎯</span>
    `;
  }

  const metrics = TIER_METRICS[safeTier] || TIER_METRICS.mamadei;
  const ratingDef = RATING_TIERS[safeTier] || RATING_TIERS.mamadei;

  return `
    <span style="
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${metrics.fill};
      border: 1.5px solid #141416;
      font-size: 10px;
      line-height: 1;
      flex-shrink: 0;
    ">
      ${ratingDef.emoji}
    </span>
  `;
}

/**
 * 🏷️ Creates Marker divIcon
 * @param isPopupOpen when true, completely hides the overhead nameplate so it doesn't overlap the popup card!
 */
function createRpgFoodIcon(group: Place[], isZoomedIn: boolean, isPopupOpen: boolean) {
  const primary = group[0];
  const isCluster = group.length > 1;
  const safeTier = primary.current_tier || 'mamadei';
  const metrics = TIER_METRICS[safeTier] || TIER_METRICS.mamadei;

  const chibiSvg = getChibiPixelFoodSvg(
    primary.id || primary.name,
    primary.category || '',
    primary.is_requested ? '#FFFFFF' : metrics.fill,
    primary.is_requested ? '#D1D5DB' : metrics.accent
  );

  const clusterCountBadge = isCluster
    ? `<div style="
        position: absolute;
        top: -3px;
        right: -3px;
        background: #FF3B30;
        color: #FFFFFF;
        border: 2px solid #141416;
        border-radius: 9999px;
        font-family: 'Baloo 2', sans-serif;
        font-weight: 800;
        font-size: 10px;
        min-width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 1.5px 1.5px 0px #141416;
        z-index: 25;
      ">${group.length}</div>`
    : '';

  const labelText = isCluster ? `Hawker Hub (${group.length})` : primary.name;
  const inlineTierBadge = getInlineTierIconBadge(safeTier, Boolean(primary.is_requested), isCluster);

  // If the popup is open, suppress the overhead nameplate
  const showLabel = isZoomedIn && !isPopupOpen;

  return L.divIcon({
    className: 'rpg-food-marker-container',
    html: `
      <div class="rpg-marker-wrapper ${showLabel ? 'zoom-expanded' : ''}" style="width: 44px; height: 44px;">
        
        <!-- Overhead Label (hidden when popup is active) -->
        <div class="rpg-nameplate" style="${isPopupOpen ? 'display: none !important;' : ''}">
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
          ">
            <div style="
              background: #FFFDF7;
              border: 2px solid #141416;
              border-radius: 8px;
              padding: 2.5px 7px;
              display: flex;
              align-items: center;
              gap: 5px;
              box-shadow: 2px 2px 0px #141416;
            ">
              <span style="
                font-family: 'Baloo 2', sans-serif;
                font-weight: 800;
                font-size: 11.5px;
                line-height: 1.2;
                color: #141416;
                max-width: 130px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">
                ${labelText}
              </span>
              ${inlineTierBadge}
            </div>

            <div style="
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid #141416;
              margin-top: -1px;
            "></div>
          </div>
        </div>

        <!-- Chibi Pixel Food Sprite -->
        <div class="rpg-chibi-box">
          ${chibiSvg}
          ${clusterCountBadge}
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -32],
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
  const cat = (category || '').toLowerCase();
  if (cat.includes('nasi') || cat.includes('kandar') || cat.includes('street')) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
  if (cat.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
  if (cat.includes('bbq') || cat.includes('mookata')) return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80';
  if (cat.includes('satay')) return 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=600&q=80';
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
}

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
  
  // Track which popup is currently open to hide its overhead label
  const [openPopupKey, setOpenPopupKey] = useState<string | null>(null);

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

  const groupedPlaceMarkers = useMemo(() => {
    if (!isZoomedIn) {
      return places.map((p) => ({
        key: p.id,
        lat: Number(p.lat),
        lng: Number(p.lng),
        items: [p],
      }));
    }

    const clusters: { key: string; lat: number; lng: number; items: Place[] }[] = [];
    const LAT_PROXIMITY = 0.0006;
    const LNG_PROXIMITY = 0.0006;

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

        {/* 🍜 Compact Markers */}
        {groupedPlaceMarkers.map((group) => {
          const isCluster = group.items.length > 1;
          const firstPlace = group.items[0];
          const isThisPopupOpen = openPopupKey === group.key;

          return (
            <Marker
              key={group.key}
              position={[group.lat, group.lng]}
              icon={createRpgFoodIcon(group.items, isZoomedIn, isThisPopupOpen)}
              eventHandlers={{
                popupopen: () => setOpenPopupKey(group.key),
                popupclose: () => setOpenPopupKey(null),
              }}
            >
              <Popup className="bauhaus-leaflet-popup" closeButton={false}>
                {isCluster ? (
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
                            <span className="text-xs shrink-0 font-bold">
                              {item.is_requested ? '🎯' : `${badge.emoji} ${badge.label}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
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
                              : `${RATING_TIERS[firstPlace.current_tier || 'mamadei']?.emoji} ${RATING_TIERS[firstPlace.current_tier || 'mamadei']?.label}`}
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

                      {/* 🚀 Changed label to 'View Details →' */}
                      <button
                        onClick={() => router.push(`/places/${firstPlace.id}`)}
                        className="w-full bg-bau-black text-bau-cream border-[2px] border-bau-black py-2 rounded-xl font-baloo font-extrabold text-xs shadow-bau-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                      >
                        View Details →
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
