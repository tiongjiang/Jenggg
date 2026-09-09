'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RequestHuntPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState('Street Food');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !area) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('hunt_requests').insert([
        {
          name: name.trim(),
          area: area.trim(),
          category,
          hunt_count: 1,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      alert(`🎯 "${name}" submitted to the Hunt Queue!`);
      router.push('/hunt');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert('Error submitting request: ' + msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-y-auto">
      {/* Header */}
      <div className="bg-bau-red text-white p-5 pt-[calc(env(safe-area-inset-top,44px)+16px)] border-b-[2.5px] border-bau-black flex items-center gap-3 shrink-0">
        <button
          onClick={() => router.push('/')}
          className="w-9 h-9 rounded-xl bg-bau-cream text-bau-black border-[2.5px] border-bau-black font-extrabold text-sm flex items-center justify-center shadow-bau-sm"
        >
          ←
        </button>
        <h1 className="font-baloo font-extrabold text-xl">🎯 Request a Hunt</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <div>
          <label className="block font-baloo font-extrabold text-xs text-bau-black mb-1">
            Eatery / Spot Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kedai Kopi Wah Cheong"
            className="w-full bg-white border-[2.5px] border-bau-black rounded-xl p-3 text-xs font-semibold outline-none shadow-bau-sm"
          />
        </div>

        <div>
          <label className="block font-baloo font-extrabold text-xs text-bau-black mb-1">
            Area / Town *
          </label>
          <input
            type="text"
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. SS2, PJ or Klang"
            className="w-full bg-white border-[2.5px] border-bau-black rounded-xl p-3 text-xs font-semibold outline-none shadow-bau-sm"
          />
        </div>

        <div>
          <label className="block font-baloo font-extrabold text-xs text-bau-black mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border-[2.5px] border-bau-black rounded-xl p-3 text-xs font-semibold outline-none shadow-bau-sm"
          >
            <option value="Street Food">Street Food</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Cafe">Cafe / Kopitiam</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div>
          <label className="block font-baloo font-extrabold text-xs text-bau-black mb-1">
            Why should the community hunt this?
          </label>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Secret sambal, crispy pork belly, special gravy..."
            className="w-full bg-white border-[2.5px] border-bau-black rounded-xl p-3 text-xs font-semibold outline-none shadow-bau-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-bau-red text-white py-3.5 rounded-xl font-baloo font-extrabold text-sm border-[2.5px] border-bau-black shadow-bau active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : '🚀 Submit Request (+50 XP)'}
        </button>
      </form>
    </div>
  );
}
