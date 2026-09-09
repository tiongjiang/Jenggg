'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase, Place } from '@/lib/supabase';
import { RATING_TIERS } from '@/lib/ratings';

interface CommentItem {
  id: string;
  hunter_name: string;
  body: string;
  created_at: string;
}

export default function PlaceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const placeId = params?.id as string;

  const [place, setPlace] = useState<Place | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!placeId) return;
      try {
        setLoading(true);
        // Fetch place
        const { data: pData } = await supabase.from('places').select('*').eq('id', placeId).single();
        if (pData) setPlace(pData as Place);

        // Fetch comments
        const { data: cData } = await supabase
          .from('comments')
          .select('*')
          .eq('place_id', placeId)
          .eq('flagged', false)
          .order('created_at', { ascending: false });
        if (cData) setComments(cData as CommentItem[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [placeId]);

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase.from('comments').insert([
        {
          place_id: placeId,
          hunter_name: authorName.trim(),
          body: newComment.trim(),
        },
      ]);
      if (error) throw error;

      setNewComment('');
      // Reload comments
      const { data: cData } = await supabase.from('comments').select('*').eq('place_id', placeId).eq('flagged', false);
      if (cData) setComments(cData as CommentItem[]);
    } catch (err) {
      alert('Error posting comment');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex-1 bg-bau-cream flex items-center justify-center font-baloo font-bold text-gray-500">Loading Spot...</div>;
  if (!place) return <div className="flex-1 bg-bau-cream flex flex-col items-center justify-center p-6"><h2 className="font-baloo font-extrabold text-lg">Not Found</h2></div>;

  const rating = RATING_TIERS[place.current_tier || 'meh'];

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-y-auto">
      {/* Banner */}
      <div className="bg-bau-yellow border-b-[2.5px] border-bau-black p-5 pt-[calc(env(safe-area-inset-top,44px)+16px)] shrink-0">
        <button onClick={() => router.push('/')} className="w-9 h-9 rounded-xl bg-bau-cream border-[2.5px] border-bau-black font-extrabold text-sm flex items-center justify-center shadow-bau-sm mb-3">
          ←
        </button>
        <h1 className="font-baloo font-extrabold text-2xl text-bau-black leading-tight">{place.name}</h1>
        <div className="text-xs font-bold text-gray-800 mt-0.5">{place.category}</div>
      </div>

      <div className="p-4 flex flex-col gap-4 pb-12">
        {/* Curated Official Verdict */}
        <div className="bg-[#191B28] border-[2.5px] border-bau-black rounded-2xl p-5 text-bau-cream relative overflow-hidden shadow-bau">
          <div className="text-[10px] text-bau-yellow font-extrabold tracking-widest uppercase font-space">
            🏆 OFFICIAL VERDICT
          </div>
          <div className="font-baloo font-extrabold text-3xl text-white my-1">
            {rating.emoji} {rating.label}
          </div>
          <p className="text-xs leading-relaxed text-gray-200 mt-2 mb-3">
            &quot;{place.quote || place.description}&quot;
          </p>
        </div>

        {/* Independent Curator Disclosure */}
        <div className="bg-white border-2 border-dashed border-bau-black rounded-xl p-3.5 text-xs text-gray-700">
          🔒 <strong>Independent Process:</strong> Every visit is paid for out-of-pocket. There are zero sponsorships, free meals, or paid endorsements. Our ratings remain 100% authentic and unbiased.
        </div>

        {/* Separated Community Comments Section */}
        <div className="border-t-[2.5px] border-bau-black pt-4">
          <h3 className="font-baloo font-extrabold text-base text-bau-black mb-3">👥 Community Discussion</h3>
          
          <form onSubmit={handlePostComment} className="flex flex-col gap-2.5 mb-5 bg-white p-4 border-[2.5px] border-bau-black rounded-xl shadow-bau-sm">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold outline-none"
            />
            <textarea
              placeholder="Leave a comment or parking tip..."
              required
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-xs font-semibold outline-none resize-none"
            />
            <button type="submit" disabled={submitting} className="bg-bau-black text-white py-2 rounded-lg text-xs font-bold font-baloo active:scale-95 transition-all">
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <div className="flex flex-col gap-2.5">
            {comments.map((c) => (
              <div key={c.id} className="bg-white border-[2.5px] border-bau-black rounded-xl p-3 shadow-bau-sm text-xs">
                <div className="flex justify-between items-center mb-1 font-bold text-bau-black">
                  <span>{c.hunter_name}</span>
                  <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
