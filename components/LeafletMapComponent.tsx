'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '@/lib/supabase';

interface MapProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
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
  });
}

export default function LeafletMapComponent({ places, onSelectPlace }: MapProps) {
  return (
    <MapContainer
      center={[3.1292, 101.6784]}
      zoom={13}
      zoomControl={false}
      attributionControl={false}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[Number(place.lat), Number(place.lng)]}
          icon={createPinIcon(place.current_tier, place.is_requested)}
          eventHandlers={{
            click: () => onSelectPlace(place),
          }}
        />
      ))}
    </MapContainer>
  );
}
