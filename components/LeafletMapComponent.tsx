'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { Place } from '@/lib/supabase';
import { TrainerBoy } from './TrainerBoy';
import { RATING_TIERS } from '@/lib/ratings';

interface MapProps {
  places: Place[];
}

function createPinIcon(tier: string | null, isRequested: boolean) {
  const isReq = Boolean(isRequested);
  const safeTier = tier || 'mamadei';
  const tierClass = isReq ? 'pin-requested' : `pin-${safeTier}`;

  const ratingDef = RATING_TIERS[safeTier] || RATING_TIERS['mamadei'];
  const label = isReq ? '🎯 Requested' : `${ratingDef.emoji} ${ratingDef.label}`;

  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div class="bauhaus-pin ${tierClass}">
        <div class="pin-badge" style="background-color: ${isReq ? '#FFFFFF' : ratingDef.bgHex}; color: #141416;">${label}</div>
        <div class="pin-stem" style="background-color: ${isReq ? '#FFFFFF' : ratingDef.bgHex};"></div>
      </div>
    `,
    iconSize: [80, 42],
    iconAnchor: [40, 42],
    popupAnchor: [0, -42],
  });
}

// User Trainer Boy Icon
function createUserTrainerIcon() {
  return L.divIcon({
    className: 'user-trainer-marker',
    html: `
      <!-- Added .user-trainer-sprite class here to counter-tilt it! -->
      <div class="user-trainer-sprite" style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
        <!-- Pulsing interaction reach halo -->
        <div style="position:absolute;inset:-15px;border-radius:50%;background:rgba(255,204,0,0.25); border: 2px solid rgba(255,204,0,0.6); animation:pulse 2s infinite; transform: rotateX(45deg);"></div>
        <!-- Shadow -->
        <div style="position:absolute;bottom:2px;width:24px;height:7px;border-radius:50%;background:rgba(0,0,0,0.45);filter:blur(1px);"></div>
        <!-- 2D Trainer Boy -->
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
  });
}

function getFallbackImage(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes('nasi') || cat.includes('kandar') || cat.includes('street')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('burger')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('bbq') || cat.includes('mookata')) {
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('satay')) {
    return 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('entertainment') || cat.includes('arcade')) {
    return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
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
  const [userPos, setUserPos] = useState<[number, number]>([3.1292, 101.6784]); // Default: Bangsar

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.warn('GPS default to Bangsar:', err.message),
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
      alert("GPS Geolocation not supported by this browser.");
    }
  }

  return (
    <div className="w-full h-full relative">
      {/* 🚀 ADDED .map-3d-wrapper HERE */}
      <div className="map-3d-wrapper">
        <MapContainer
          center={userPos}
          zoom={14}
          zoomControl={false}
          attributionControl={false}
          className="w-full h-full"
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <MapController center={userPos} />

          {/* 👤 Live User GPS Trainer Marker */}
          <Marker position={userPos} icon={createUserTrainerIcon()}>
            <Popup className="bauhaus-leaflet-popup font-baloo font-bold" closeButton={false}>
              <div className="bg-bau-black text-bau-yellow border-2 border-bau-yellow rounded-xl px-3 py-1.5 shadow-bau text-xs text-center">
                📍 You are here, Trainer!
              </div>
            </Popup>
          </Marker>

          {/* 📍 Curated Food Hunter Spots */}
          {places.map((place) => {
            const coverImg = getFallbackImage(place.category || '');
            const safeTier = place.current_tier || 'mamadei';
            const ratingDef = RATING_TIERS[safeTier] || RATING_TIERS['mamadei'];
            const officialBadge = place.is_requested ? '🎯 Requested' : `${ratingDef.emoji} ${ratingDef.label}`;

            return (
              <Marker
                key={place.id}
                position={[Number(place.lat), Number(place.lng)]}
                icon={createPinIcon(place.current_tier, place.is_requested)}
              >
                <Popup className="bauhaus-leaflet-popup" closeButton={false}>
                  <div className="w-[230px] bg-bau-cream border-[2.5px] border-bau-black rounded-2xl overflow-hidden shadow-bau select-none">
                    <div className="h-24 w-full relative overflow-hidden bg-gray-950 border-b-2 border-bau-black">
                      <img src={coverImg} alt={place.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-bau-cream border-[1.5px] border-bau-black rounded-full px-2 py-0.5 font-baloo font-extrabold text-[10px] shadow-bau-sm text-bau-black">
                        {place.price_level || '💰💰'}
                      </div>
                      <div className="absolute bottom-1.5 left-2 bg-black/60 backdrop-blur-sm text-white font-semibold text-[9px] px-2 py-0.5 rounded-md">
                        📍 {place.area || 'Klang Valley'}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-baloo font-extrabold text-sm leading-tight text-bau-black truncate">{place.name}</h3>
                      <div className="text-[10px] text-gray-500 font-semibold truncate mb-2">{place.category}</div>
                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        <div className="bg-[#191B28] text-white p-1.5 rounded-lg border border-bau-black">
                          <span className="block text-[8px] font-space tracking-wider uppercase text-bau-yellow font-bold">Official</span>
                          <span className="font-baloo font-extrabold text-[11px] truncate block">{officialBadge}</span>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-bau-black text-bau-black">
                          <span className="block text-[8px] font-space tracking-wider text-gray-500 font-bold uppercase">Hunters</span>
                          <span className="font-baloo font-extrabold text-[11px] block text-bau-red">★ 4.8</span>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/places/${place.id}`)}
                        className="w-full bg-bau-black text-bau-cream border-[2px] border-bau-black py-2 rounded-xl font-baloo font-extrabold text-xs shadow-bau-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                      >
                        View Full Verdict →
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Floating GPS Recenter button (📍) kept safely ABOVE the 3D wrapper */}
      <button
        type="button"
        onClick={locateMe}
        className="absolute bottom-5 left-3.5 z-[1000] w-11 h-11 rounded-full bg-bau-cream border-[2.5px] border-bau-black shadow-bau flex items-center justify-center text-lg active:translate-x-0.5 active:translate-y-0.5 transition-transform"
        title="Recenter GPS"
      >
        📍
      </button>
    </div>
  );
}
