'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Place, HuntRequest } from '@/lib/supabase';

export default function AdminConsolePage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [requests, setRequests] = useState<HuntRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    try {
      setLoading(true);
      const { data: pData } = await supabase.from('places').select('*');
      if (pData) setPlaces(pData as Place[]);

      const { data: hData } = await supabase.from('hunt_requests').select('*').order('hunt_count', { ascending: false });
      if (hData) setRequests(hData as HuntRequest[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteRequest(id: string) {
    if (!confirm('Are you sure you want to reject and delete this request?')) return;
    const { error } = await supabase.from('hunt_requests').delete().eq('id', id);
    if (!error) {
      alert('Request rejected & removed!');
      fetchAdminData();
    }
  }

  async function handleApproveRequest(req: HuntRequest) {
    const latInput = prompt('Enter Latitude coordinate (e.g. 3.129200):');
    const lngInput = prompt('Enter Longitude coordinate (e.g. 101.678400):');
    if (!latInput || !lngInput) return;

    // Insert new place into places
    const { error: pErr } = await supabase.from('places').insert([
      {
        name: req.name,
        category: req.category,
        area: req.area,
        lat: parseFloat(latInput),
        lng: parseFloat(lngInput),
        price_level: '💰💰',
        current_tier: null, // Pending review
        quote: 'Hunted by popular request! Awaiting official review.',
        description: 'Approved community-requested spot.',
        is_requested: true,
        request_count: req.hunt_count,
      },
    ]);

    if (pErr) {
      alert('Error approving spot: ' + pErr.message);
      return;
    }

    // Delete request from queue
    await supabase.from('hunt_requests').delete().eq('id', req.id);
    alert(`🎉 "${req.name}" approved! It has been successfully added to the Map Canvas.`);
    fetchAdminData();
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-y-auto">
      {/* Header */}
      <div className="bg-bau-black text-bau-cream p-5 pt-[calc(env(safe-area-inset-top,44px)+16px)] border-b-[2.5px] border-bau-black flex items-center gap-3 shrink-0">
        <button
          onClick={() => router.push('/profile')}
          className="w-9 h-9 rounded-xl bg-bau-cream text-bau-black border-[2.5px] border-bau-black font-extrabold text-sm flex items-center justify-center shadow-bau-sm"
        >
          ←
        </button>
        <h1 className="font-baloo font-extrabold text-xl">⚙️ Admin Console</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {loading ? (
          <div className="text-center font-baloo font-bold text-gray-500 my-8">Syncing telemetry data...</div>
        ) : (
          <>
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border-[2px] border-bau-black rounded-xl p-3 shadow-bau-sm">
                <div className="font-baloo font-extrabold text-2xl text-bau-blue">{places.length}</div>
                <div className="text-[10px] font-bold text-gray-500">Live Map Spots</div>
              </div>
              <div className="bg-white border-[2px] border-bau-black rounded-xl p-3 shadow-bau-sm">
                <div className="font-baloo font-extrabold text-2xl text-bau-red">{requests.length}</div>
                <div className="text-[10px] font-bold text-gray-500">Active Requests</div>
              </div>
            </div>

            {/* Submissions Queue */}
            <div className="font-baloo font-extrabold text-xs uppercase tracking-wider text-bau-black mt-2">
              📥 Incoming Hunt Submissions
            </div>

            {requests.length === 0 ? (
              <div className="bg-white border-[2.5px] border-bau-black rounded-2xl p-6 text-center text-xs text-gray-500 shadow-bau-sm">
                Queue empty! No active community requests.
              </div>
            ) : (
              requests.map((r, idx) => (
                <div
                  key={r.id}
                  className="bg-white border-[2.5px] border-bau-black rounded-2xl p-4 shadow-bau-sm flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block">Request #{idx + 1}</span>
                      <h4 className="font-baloo font-extrabold text-base text-bau-black leading-tight">{r.name}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{r.area} · {r.category}</p>
                    </div>
                    <div className="bg-bau-dim border border-bau-black font-baloo font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      🔥 {r.hunt_count} Votes
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => handleApproveRequest(r)}
                      className="flex-1 bg-bau-green text-white border-[1.5px] border-bau-black font-baloo font-extrabold text-xs py-2 rounded-lg shadow-bau-sm"
                    >
                      Approve & Pin
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(r.id)}
                      className="bg-red-50 text-bau-red border-[1.5px] border-bau-black font-baloo font-extrabold text-xs px-3.5 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
