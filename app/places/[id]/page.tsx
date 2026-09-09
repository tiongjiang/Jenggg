'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase, Place } from '@/lib/supabase';

interface OfficialReview {
  id: string;
  hunter_name: string;
  rating_tier: string;
  star_rating: number;
  food_score: number;
  service_score: number;
  env_score: number;
  value_score: number;
  verdict_text: string;
  reviewed_at: string;
}

export default function PlaceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const placeId = params?.id as string;

  const [place, setPlace] = useState<Place | null>(null);
  const [review, setReview] = useState<OfficialReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaceData() {
      if (!placeId) return;
      try {
        // Fetch place info
        const { data: pData } = await supabase
          .from('places')
          .select('*')
          .eq('id', placeId)
          .single();
        if (pData) setPlace(pData as Place);

        // Fetch official review
        const { data: rData } = await supabase
          .from('reviews')
          .select('*')
          .eq('place_id', placeId)
          .eq('is_official', true)
          .limit(1);
        if (rData && rData.length > 0) setReview(rData[0] as OfficialReview);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaceData();
  }, [placeId]);

  if (loading) {
    return (
      <div className="flex-1 bg-bau-cream flex items-center justify-center font-baloo font-bold text-lg">
        Loading Spot...
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex-1 bg-bau-cream p-6 flex flex-col items-center justify-center gap-4">
        <h2 className="font-baloo font-extrabold text-xl">Place Not Found</h2>
        <button
          onClick={() => router.push('/')}
          className="bg-bau-black text-white px-5 py-2.5 rounded-xl font-baloo font-bold text-sm"
        >
          Back to Map
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-y-auto">
      {/* Header Banner */}
      <div className="bg-bau-yellow border-b-[2.5px] border-bau-black p-5 pt-12 relative overflow-hidden">
        <button
          onClick={() => router.push('/')}
          className="w-9 h-9 rounded-xl bg-bau-cream border-[2.5px] border-bau-black font-extrabold text-sm flex items-center justify-center shadow-bau-sm active:translate-x-0.5 active:translate-y-0.5 mb-3"
        >
          ←
        </button>
        <h1 className="font-baloo font-extrabold text-2xl text-bau-black">{place.name}</h1>
        <div className="text-xs font-bold text-gray-800 mt-1">{place.category}</div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex flex-col gap-4">
        {/* Meta tags */}
        <div className="flex gap-2 flex-wrap">
          <div className="bg-white border-[1.5px] border-bau-black rounded-full px-3 py-1 font-bold text-xs shadow-bau-sm">
            📍 {place.area || 'Klang Valley'}
          </div>
          <div className="bg-white border-[1.5px] border-bau-black rounded-full px-3 py-1 font-bold text-xs shadow-bau-sm">
            {place.price_level || '💰💰'}
          </div>
        </div>

        {/* 1. Overview description */}
        <div className="bg-white border-[2.5px] border-bau-black rounded-2xl p-4 text-xs leading-relaxed text-gray-800 shadow-bau-sm">
          <strong className="block font-baloo text-sm mb-1 text-bau-black">About This Place</strong>
          {place.description || place.quote || 'No detailed description available yet.'}
        </div>

        {/* 2. Official Review Stamp (Directly below Overview, no rating history) */}
        <div className="bg-[#191B28] border-[2.5px] border-bau-black rounded-2xl p-5 text-bau-cream relative overflow-hidden shadow-bau">
          <div className="text-[10px] text-bau-yellow font-extrabold tracking-widest uppercase font-space">
            🏆 Official Food Hunter Verdict
          </div>

          <div className="font-baloo font-extrabold text-3xl text-white my-1">
            {place.is_requested
              ? '🎯 Requested'
              : place.current_tier === 'jengggg'
              ? '🔥 Jengggg'
              : place.current_tier === 'hociakk'
              ? '🤤 Hociakk'
              : place.current_tier === 'mamadei'
              ? '😐 Ma Ma Dei'
              : '🤨 Hmmm'}
          </div>

          {review ? (
            <>
              {/* Score breakdown */}
              <div className="grid grid-cols-2 gap-2 my-3">
                <div className="bg-white/10 border border-white/15 rounded-lg p-2 text-[11px]">
                  <span className="text-gray-400 block">Food Quality</span>
                  <span className="font-baloo font-extrabold text-sm text-bau-yellow">
                    {'★'.repeat(review.food_score || 5)}
                  </span>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-lg p-2 text-[11px]">
                  <span className="text-gray-400 block">Service</span>
                  <span className="font-baloo font-extrabold text-sm text-bau-yellow">
                    {'★'.repeat(review.service_score || 4)}
                  </span>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-lg p-2 text-[11px]">
                  <span className="text-gray-400 block">Environment</span>
                  <span className="font-baloo font-extrabold text-sm text-bau-yellow">
                    {'★'.repeat(review.env_score || 5)}
                  </span>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-lg p-2 text-[11px]">
                  <span className="text-gray-400 block">Value</span>
                  <span className="font-baloo font-extrabold text-sm text-bau-yellow">
                    {'★'.repeat(review.value_score || 4)}
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-200 mt-2 mb-3">
                &quot;{review.verdict_text}&quot;
              </p>

              <div className="flex justify-between text-[10px] text-gray-400 border-t border-white/15 pt-2">
                <span>Hunter: {review.hunter_name}</span>
                <span>Reviewed: {review.reviewed_at}</span>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-300 mt-2">
              Official Food Hunter review pending. Stay tuned for the complete verdict!
            </p>
          )}
        </div>

        <button
          onClick={() => router.push('/')}
          className="bg-bau-black text-white py-3 rounded-xl font-baloo font-extrabold text-sm border-[2.5px] border-bau-black shadow-bau active:translate-x-0.5 active:translate-y-0.5"
        >
          Back to Game Board
        </button>
      </div>
    </div>
  );
}
