'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase, Place } from '@/lib/supabase';
import { RATING_TIERS } from '@/lib/ratings';
import { useFavorites } from '@/lib/useFavorites';

interface ReviewItem {
  id: string;
  hunter_name: string;
  rating_tier: string;
  star_rating: number;
  food_score?: number;
  service_score?: number;
  env_score?: number;
  value_score?: number;
  verdict_text: string;
  is_official: boolean;
  reviewed_at: string;
}

export default function PlaceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const placeId = params?.id as string;

  const [place, setPlace] = useState<Place | null>(null);
  const [officialReview, setOfficialReview] = useState<ReviewItem | null>(null);
  const [communityReviews, setCommunityReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔒 Security Check State
  const [isAdmin, setIsAdmin] = useState(false);

  // Leave Community Review Form State
  const [showReviewForm, setShowForm] = useState(false);
  const [hunterName, setHunterName] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('jengggg');
  const [starRating, setStarRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // ⚙️ Admin Edit Modal State
  const [showAdminEditModal, setShowAdminEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Street Food',
    area: '',
    lat: '',
    lng: '',
    price_level: '💰💰',
    current_tier: 'mamadei',
    quote: '',
    is_requested: false,
  });
  const [submittingAdminEdit, setSubmittingAdminEdit] = useState(false);

  // Favorites Hook
  const { favorites, toggleFavorite } = useFavorites();
  const isFav = favorites.includes(placeId);

  useEffect(() => {
    checkAdminPrivileges();
    loadPlaceAndReviews();
  }, [placeId]);

  // Check if current user is tiongjiang98@gmail.com
  async function checkAdminPrivileges() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === 'tiongjiang98@gmail.com') {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error('Handshake failed:', err);
    }
  }

  async function loadPlaceAndReviews() {
    if (!placeId) return;
    try {
      setLoading(true);
      
      // 1. Fetch Spot
      const { data: pData } = await supabase.from('places').select('*').eq('id', placeId).single();
      if (pData) {
        setPlace(pData as Place);
        setEditForm({
          name: pData.name,
          category: pData.category || 'Street Food',
          area: pData.area || '',
          lat: pData.lat.toString(),
          lng: pData.lng.toString(),
          price_level: pData.price_level || '💰💰',
          current_tier: pData.current_tier || 'mamadei',
          quote: pData.quote || '',
          is_requested: Boolean(pData.is_requested),
        });
      }

      // 2. Fetch Reviews
      const { data: rData } = await supabase.from('reviews').select('*').eq('place_id', placeId).order('created_at', { ascending: false });
      if (rData) {
        const official = rData.find((r) => r.is_official) || null;
        const community = rData.filter((r) => !r.is_official);
        setOfficialReview(official as ReviewItem);
        setCommunityReviews(community as ReviewItem[]);
      }
    } catch (err) {
      console.error('Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Community Review Submission
  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!hunterName.trim() || !comment.trim()) return;

    try {
      setSubmittingReview(true);
      const { error } = await supabase.from('reviews').insert([
        {
          place_id: placeId,
          hunter_name: hunterName.trim(),
          rating_tier: selectedTier,
          star_rating: starRating,
          verdict_text: comment.trim(),
          is_official: false,
          reviewed_at: new Date().toISOString().split('T')[0],
        },
      ]);

      if (error) throw error;

      alert('🎉 Review posted! +25 Hunter XP gained.');
      setShowForm(false);
      setComment('');
      loadPlaceAndReviews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert('Error: ' + msg);
    } finally {
      setSubmittingReview(false);
    }
  }

  // Handle Admin Direct Inline Edit Submission
  async function handleAdminEditSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmittingAdminEdit(true);
      const payload = {
        name: editForm.name,
        category: editForm.category,
        area: editForm.area,
        lat: parseFloat(editForm.lat),
        lng: parseFloat(editForm.lng),
        price_level: editForm.price_level,
        current_tier: editForm.current_tier,
        quote: editForm.quote,
        is_requested: editForm.is_requested,
      };

      const { error } = await supabase.from('places').update(payload).eq('id', placeId);
      if (error) throw error;

      alert('💾 Spot details updated successfully!');
      setShowAdminEditModal(false);
      loadPlaceAndReviews();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert('Error updating spot: ' + msg);
    } finally {
      setSubmittingAdminEdit(false);
    }
  }

  function getTierBadge(tier: string) {
    if (tier === 'jengggg') return { label: '🔥 Jengggg', bg: 'bg-bau-yellow text-bau-black' };
    if (tier === 'hociakk') return { label: '🤤 Hociakk', bg: 'bg-bau-green text-white' };
    if (tier === 'mamadei') return { label: '😐 Ma Ma Dei', bg: 'bg-bau-dim text-bau-black' };
    return { label: '🤨 Hmmm', bg: 'bg-gray-300 text-bau-black' };
  }

  if (loading) {
    return (
      <div className="flex-1 bg-bau-cream flex items-center justify-center font-baloo font-bold text-sm text-gray-500">
        ⚡ Loading place & reviews...
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex-1 bg-bau-cream p-6 flex flex-col items-center justify-center gap-3">
        <h2 className="font-baloo font-extrabold text-xl">Place Not Found</h2>
        <button onClick={() => router.push('/')} className="bg-bau-black text-white px-5 py-2.5 rounded-xl font-baloo font-bold text-xs">
          Back to Map
        </button>
      </div>
    );
  }

  const defaultRatingDef = RATING_TIERS[place.current_tier || 'mamadei'] || RATING_TIERS['mamadei'];
  const openingHours = (place as any).opening_hours || 'Mon - Sun: 10:00 AM - 10:00 PM (Closed Tuesdays)';
  const gallery = (place as any).gallery || [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&q=80'
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-y-auto">
      {/* Top Banner with Safe Area Header Padding */}
      <div className="bg-bau-yellow border-b-[2.5px] border-bau-black p-5 pt-[calc(env(safe-area-inset-top,44px)+16px)] relative shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="w-9 h-9 rounded-xl bg-bau-cream border-[2.5px] border-bau-black font-extrabold text-sm flex items-center justify-center shadow-bau-sm active:translate-x-0.5 active:translate-y-0.5"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            {/* ⭐ FAVORITE BUTTON */}
            <button 
              onClick={() => toggleFavorite(placeId)}
              className={`border-[2.5px] border-bau-black font-baloo font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-bau-sm active:scale-95 transition-all ${
                isFav ? 'bg-bau-red text-white' : 'bg-white text-bau-black'
              }`}
            >
              {isFav ? '⭐ Saved' : '☆ Save Spot'}
            </button>

            {/* 🔒 ADMIN ONLY: Direct Edit Button */}
            {isAdmin && (
              <button
                onClick={() => setShowAdminEditModal(true)}
                className="bg-bau-blue text-white border-[2.5px] border-bau-black font-baloo font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-bau-sm active:scale-95 transition-transform"
              >
                ✏️ Edit Spot
              </button>
            )}
          </div>
        </div>

        <h1 className="font-baloo font-extrabold text-2xl text-bau-black leading-tight mt-3">
          {place.name}
        </h1>
        <div className="text-xs font-bold text-gray-800 mt-0.5">{place.category}</div>
      </div>

      <div className="p-4 flex flex-col gap-4 pb-12">
        {/* Meta Chips */}
        <div className="flex gap-2 flex-wrap">
          <div className="bg-white border-[1.5px] border-bau-black rounded-full px-3 py-1 font-bold text-xs shadow-bau-sm">📍 {place.area || 'Klang Valley'}</div>
          <div className="bg-white border-[1.5px] border-bau-black rounded-full px-3 py-1 font-bold text-xs shadow-bau-sm">{place.price_level || '💰💰'}</div>
        </div>

        {/* Overview */}
        <div className="bg-white border-[2.5px] border-bau-black rounded-2xl p-4 text-xs leading-relaxed text-gray-800 shadow-bau-sm">
          <strong className="block font-baloo text-sm mb-1 text-bau-black">About This Place</strong>
          {place.description || place.quote || 'No detailed description available yet.'}
        </div>

        {/* 🕒 OPENING HOURS */}
        <div className="bg-white border-[2.5px] border-bau-black rounded-2xl p-4 text-xs shadow-bau-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-bau-cream rounded-full border-2 border-bau-black flex items-center justify-center text-lg shrink-0">🕒</div>
          <div>
            <strong className="block font-baloo text-sm text-bau-black">Operating Hours</strong>
            <span className="font-semibold text-gray-600">{openingHours}</span>
          </div>
        </div>

        {/* 2. Official Verdict Stamp */}
        <div className="bg-[#191B28] border-[2.5px] border-bau-black rounded-2xl p-5 text-bau-cream relative overflow-hidden shadow-bau">
          <div className="text-[10px] text-bau-yellow font-extrabold tracking-widest uppercase font-space">🏆 OFFICIAL FOOD HUNTER VERDICT</div>
          <div className="font-baloo font-extrabold text-3xl text-white my-1">
            {place.is_requested ? '🎯 Requested' : `${defaultRatingDef.emoji} ${defaultRatingDef.label}`}
          </div>

          {officialReview ? (
            <>
              {/* Detailed Breakdown */}
              <div className="grid grid-cols-2 gap-2 my-3">
                <div className="bg-white/10 border border-white/15 rounded-lg p-2 text-[11px]"><span className="text-gray-400 block">Food Quality</span><span className="font-baloo font-extrabold text-sm text-bau-yellow">{'★'.repeat(officialReview.food_score || 5)}</span></div>
                <div className="bg-white/10 border border-white/15 rounded-lg p-2 text-[11px]"><span className="text-gray-400 block">Service</span><span className="font-baloo font-extrabold text-sm text-bau-yellow">{'★'.repeat(officialReview.service_score || 4)}</span></div>
                <div className="bg-white/10 border border-white/15 rounded-lg p-2 text-[11px]"><span className="text-gray-400 block">Environment</span><span className="font-baloo font-extrabold text-sm text-bau-yellow">{'★'.repeat(officialReview.env_score || 5)}</span></div>
                <div className="bg-white/10 border border-white/15 rounded-lg p-2 text-[11px]"><span className="text-gray-400 block">Value</span><span className="font-baloo font-extrabold text-sm text-bau-yellow">{'★'.repeat(officialReview.value_score || 4)}</span></div>
              </div>

              <p className="text-xs leading-relaxed text-gray-200 mt-2 mb-3">&quot;{officialReview.verdict_text}&quot;</p>
              <div className="flex justify-between text-[10px] text-gray-400 border-t border-white/15 pt-2"><span>Lead Hunter: {officialReview.hunter_name}</span><span>Reviewed: {officialReview.reviewed_at}</span></div>
            </>
          ) : (
            <p className="text-xs text-gray-300 mt-2">Official Food Hunter audit pending. Community hunters can leave reviews below!</p>
          )}
        </div>

        {/* Curator Disclaimer */}
        <div className="bg-white border-2 border-dashed border-bau-black rounded-xl p-3.5 text-xs text-gray-700">
          🔒 <strong>Independent Process:</strong> Every visit is paid for out-of-pocket. There are zero sponsorships, free meals, or paid endorsements. Our ratings remain 100% authentic and unbiased.
        </div>

        {/* 📸 GALLERY GRID */}
        <div className="bg-white border-[2.5px] border-bau-black rounded-2xl p-4 shadow-bau-sm">
          <h3 className="font-baloo font-extrabold text-base text-bau-black mb-2">📸 Vibe & Gallery</h3>
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((img: string, i: number) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl border-[2px] border-bau-black overflow-hidden shadow-bau-sm">
                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Community Hunters Reviews Section */}
        <div className="flex flex-col gap-2.5 mt-1 border-t-[2.5px] border-bau-black pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-baloo font-extrabold text-base text-bau-black flex items-center gap-1.5">
              <span>👥 Community Hunters</span>
              <span className="text-xs font-inter font-normal text-gray-500">({communityReviews.length})</span>
            </h3>
            <button onClick={() => setShowForm(true)} className="bg-bau-yellow text-bau-black border-[1.5px] border-bau-black font-baloo font-extrabold text-xs px-3 py-1 rounded-full shadow-bau-sm active:scale-95 transition-transform">
              + Write Review
            </button>
          </div>

          {communityReviews.length === 0 ? (
            <div className="bg-white border-[2.5px] border-bau-black rounded-2xl p-5 text-center text-xs text-gray-500 shadow-bau-sm">No community reviews yet. Be the first hunter to rate this spot!</div>
          ) : (
            communityReviews.map((rev) => {
              const badge = getTierBadge(rev.rating_tier);
              return (
                <div key={rev.id} className="bg-white border-[2.5px] border-bau-black rounded-2xl p-3.5 shadow-bau-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-bau-blue text-white font-baloo font-extrabold text-xs flex items-center justify-center border border-bau-black">{rev.hunter_name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="font-extrabold text-xs text-bau-black">{rev.hunter_name}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{rev.reviewed_at}</div>
                      </div>
                    </div>
                    <div className={`${badge.bg} border border-bau-black font-baloo font-extrabold text-[10px] px-2 py-0.5 rounded-full`}>{badge.label}</div>
                  </div>
                  <p className="text-xs text-gray-700 leading-normal font-medium">&quot;{rev.verdict_text}&quot;</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 👥 MODAL: LEAVE REVIEW */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-bau-cream border-[2.5px] border-bau-black rounded-3xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-baloo font-extrabold text-lg">✍️ Hunter Review</h3>
              <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-full bg-white border border-bau-black font-bold text-xs flex items-center justify-center">✕</button>
            </div>
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-3">
              <div>
                <label className="block font-baloo font-extrabold text-xs mb-1">Hunter Name *</label>
                <input type="text" required value={hunterName} onChange={(e) => setHunterName(e.target.value)} placeholder="e.g. BangsarFoodie" className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none" />
              </div>
              <div>
                <label className="block font-baloo font-extrabold text-xs mb-1">Verdict *</label>
                <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none">
                  <option value="jengggg">🔥 Jengggg (5★)</option>
                  <option value="hociakk">🤤 Hociakk (4★)</option>
                  <option value="mamadei">😐 Ma Ma Dei (3★)</option>
                  <option value="hmmm">🤨 Hmmm (2★)</option>
                </select>
              </div>
              <div>
                <label className="block font-baloo font-extrabold text-xs mb-1">Comments & Tips *</label>
                <textarea rows={3} required value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What should we order? Parking tips?" className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none resize-none" />
              </div>
              <button type="submit" disabled={submittingReview} className="mt-1 bg-bau-blue text-white py-3 rounded-xl font-baloo font-extrabold text-sm border-[2px] border-bau-black shadow-bau">{submittingReview ? 'Posting...' : '🚀 Post Review (+25 XP)'}</button>
            </form>
          </div>
        </div>
      )}

      {/* 🔒 ADMIN ONLY INLINE EDIT MODAL FORM */}
      {showAdminEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-bau-cream border-[2.5px] border-bau-black rounded-3xl p-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-baloo font-extrabold text-lg">✏️ Direct Edit Spot</h3>
              <button onClick={() => setShowAdminEditModal(false)} className="w-7 h-7 rounded-full bg-white border border-bau-black font-bold text-xs flex items-center justify-center">✕</button>
            </div>

            <form onSubmit={handleAdminEditSave} className="flex flex-col gap-3">
              <div>
                <label className="block font-baloo font-extrabold text-xs mb-1">Place Name</label>
                <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Category</label>
                  <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none">
                    <option value="Street Food">Street Food</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Area</label>
                  <input required type="text" value={editForm.area} onChange={e => setEditForm({...editForm, area: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Latitude</label>
                  <input required type="number" step="any" value={editForm.lat} onChange={e => setEditForm({...editForm, lat: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none" />
                </div>
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Longitude</label>
                  <input required type="number" step="any" value={editForm.lng} onChange={e => setEditForm({...editForm, lng: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Price Level</label>
                  <select value={editForm.price_level} onChange={e => setEditForm({...editForm, price_level: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none">
                    <option value="💰">💰 Cheap</option>
                    <option value="💰💰">💰💰 Medium</option>
                    <option value="💰💰💰">💰💰💰 Expensive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Rating Tier</label>
                  <select value={editForm.current_tier} onChange={e => setEditForm({...editForm, current_tier: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none">
                    <option value="jengggg">🔥 Jengggg (5★)</option>
                    <option value="hociakk">🤤 Hociakk (4★)</option>
                    <option value="mamadei">😐 Ma Ma Dei (3★)</option>
                    <option value="hmmm">🤨 Hmmm (2★)</option>
                    <option value="ewww">😖 Ewww (1★)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-baloo font-extrabold text-xs mb-1">Quote / Description</label>
                <textarea rows={3} value={editForm.quote} onChange={e => setEditForm({...editForm, quote: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2.5 text-xs font-semibold outline-none resize-none" />
              </div>

              <label className="flex items-center gap-2 font-baloo font-extrabold text-xs cursor-pointer">
                <input type="checkbox" checked={editForm.is_requested} onChange={e => setEditForm({...editForm, is_requested: e.target.checked})} className="w-4 h-4" />
                Flag as "Requested by Community" (Grey Pin)
              </label>

              <button type="submit" disabled={submittingAdminEdit} className="mt-2 bg-bau-blue text-white py-3.5 rounded-xl font-baloo font-extrabold text-sm border-[2.5px] border-bau-black shadow-bau active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50">
                {submittingAdminEdit ? 'Saving Changes...' : '💾 Save Spot Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
