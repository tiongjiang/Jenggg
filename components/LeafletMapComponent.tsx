'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { Place } from '@/lib/supabase';

interface MapProps {
  places: Place[];
  onSelectPlace?: (place: Place) => void;
}

function getRatingBadge(tier: string | null, isRequested: boolean) {
  if (isRequested) return '🎯 Requested';
  if (tier === 'jengggg') return '🔥 Jengggg';
  if (tier === 'hociakk') return '🤤 Hociakk';
  if (tier === 'mamadei') return '😐 Ma Ma Dei';
  if (tier === 'hmmm') return '🤨 Hmmm';
  return '😖 Ewww';
}

function createPinIcon(tier: string | null, isRequested: boolean) {
  const tierClass = isRequested ? 'pin-requested' : `pin-${tier || 'mamadei'}`;
  const label = getRatingBadge(tier, isRequested);

  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div class="bauhaus-pin ${tierClass}">
        <div class="pin-badge">${label}</div>
        <div class="pin-stem"></div>
      </div>
    `,
    iconSize: [80, 42],
    iconAnchor: [40, 42],
    popupAnchor: [0, -42], // Anchors popup directly on top of the pin!
  });
}

// Sample Malaysian food banner illustrations for visual appeal
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

export default function LeafletMapComponent({ places }: MapProps) {
  const router = useRouter();

  return (
    <MapContainer
      center={[3.1292, 101.6784]}
      zoom={13}
      zoomControl={false}
      attributionControl={false}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      {places.map((place) => {
        const coverImg = getFallbackImage(place.category || '');
        const officialTier = getRatingBadge(place.current_tier, place.is_requested);

        return (
          <Marker
            key={place.id}
            position={[Number(place.lat), Number(place.lng)]}
            icon={createPinIcon(place.current_tier, place.is_requested)}
          >
            {/* IN-PLACE FLOATING POPUP CARD DIRECTLY OVER PIN */}
            <Popup className="bauhaus-leaflet-popup" closeButton={false}>
              <div className="w-[240px] bg-bau-cream border-[2.5px] border-bau-black rounded-2xl overflow-hidden shadow-bau select-none">
                
                {/* 1. Header Cover Image with Price Tag */}
                <div className="h-24 w-full relative overflow-hidden bg-gray-900 border-b-2 border-bau-black">
                  <img
                    src={coverImg}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-bau-cream border-[1.5px] border-bau-black rounded-full px-2 py-0.5 font-baloo font-extrabold text-[10px] text-bau-black shadow-bau-sm">
                    {place.price_level || '💰💰'}
                  </div>
                  <div className="absolute bottom-1.5 left-2 bg-black/60 backdrop-blur-sm text-white font-medium text-[9px] px-2 py-0.5 rounded-md">
                    📍 {place.area || 'Klang Valley'}
                  </div>
                </div>

                {/* 2. Place Name & Category */}
                <div className="p-3">
                  <h3 className="font-baloo font-extrabold text-sm leading-tight text-bau-black truncate">
                    {place.name}
                  </h3>
                  <div className="text-[10px] text-gray-500 font-semibold truncate mb-2">
                    {place.category}
                  </div>

                  {/* 3. Official Rating vs Public Rating Side-by-Side */}
                  <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                    {/* Official Rating */}
                    <div className="bg-[#191B28] text-white p-1.5 rounded-lg border border-bau-black">
                      <span className="block text-[8px] font-space tracking-wider uppercase text-bau-yellow font-bold">
                        Official
                      </span>
                      <span className="font-baloo font-extrabold text-[11px] truncate block">
                        {officialTier}
                      </span>
                    </div>

                    {/* Public Rating */}
                    <div className="bg-white p-1.5 rounded-lg border border-bau-black text-bau-black">
                      <span className="block text-[8px] font-space tracking-wider uppercase text-gray-500 font-bold">
                        Hunters
                      </span>
                      <span className="font-baloo font-extrabold text-[11px] block text-bau-red">
                        ★ 4.8 <span className="text-[9px] text-gray-400 font-normal">(18)</span>
                      </span>
                    </div>
                  </div>

                  {/* 4. Short Description / Quote */}
                  <p className="text-[11px] text-gray-700 italic line-clamp-2 leading-tight mb-3">
                    &quot;{place.quote || place.description || 'Great spot discovered by the community!'}&quot;
                  </p>

                  {/* 5. Button to Full Place Details */}
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
  );
}
