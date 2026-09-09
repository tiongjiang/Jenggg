'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Place, HuntRequest } from '@/lib/supabase';

export default function AdminConsolePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'places' | 'requests'>('places');
  const [places, setPlaces] = useState<Place[]>([]);
  const [requests, setRequests] = useState<HuntRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Modal State for Create/Edit Place
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
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

  // 🔒 SECURITY CHECK: Gated exclusively to tiongjiang98@gmail.com
  useEffect(() => {
    async function checkSecurityGating() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !session.user || session.user.email !== 'tiongjiang98@gmail.com') {
          alert('🚫 Access Denied: You are not authorized to view the Admin Command Center.');
          router.push('/'); // Boot them instantly back to the map
          return;
        }

        // If authorized, proceed to load administrative telemetry data
        setAuthorized(true);
        fetchAdminData();
      } catch (err) {
        console.error('Security handshake failed:', err);
        router.push('/');
      }
    }

    checkSecurityGating();
  }, [router]);

  async function fetchAdminData() {
    try {
      setLoading(true);
      const { data: pData } = await supabase.from('places').select('*').order('created_at', { ascending: false });
      if (pData) setPlaces(pData as Place[]);

      const { data: hData } = await supabase.from('hunt_requests').select('*').order('hunt_count', { ascending: false });
      if (hData) setRequests(hData as HuntRequest[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // HUNT REQUESTS LOGIC
  // ==========================================
  async function handleDeleteRequest(id: string) {
    if (!confirm('Reject and delete this request?')) return;
    await supabase.from('hunt_requests').delete().eq('id', id);
    fetchAdminData();
  }

  async function handleApproveRequest(req: HuntRequest) {
    const latInput = prompt('Enter Latitude (e.g. 3.1292):');
    const lngInput = prompt('Enter Longitude (e.g. 101.6784):');
    if (!latInput || !lngInput) return;

    await supabase.from('places').insert([{
      name: req.name,
      category: req.category,
      area: req.area,
      lat: parseFloat(latInput),
      lng: parseFloat(lngInput),
      price_level: '💰💰',
      current_tier: 'mamadei',
      quote: 'Hunted by popular request! Awaiting official review.',
      is_requested: true,
      request_count: req.hunt_count,
    }]);

    await supabase.from('hunt_requests').delete().eq('id', req.id);
    alert(`🎉 "${req.name}" approved to map!`);
    fetchAdminData();
  }

  // ==========================================
  // PLACES CRUD LOGIC
  // ==========================================
  function openCreateModal() {
    setEditingId(null);
    setFormData({
      name: '', category: 'Street Food', area: '', lat: '', lng: '', price_level: '💰💰', current_tier: 'mamadei', quote: '', is_requested: false,
    });
    setShowModal(true);
  }

  function openEditModal(place: Place) {
    setEditingId(place.id);
    setFormData({
      name: place.name,
      category: place.category || 'Street Food',
      area: place.area || '',
      lat: place.lat.toString(),
      lng: place.lng.toString(),
      price_level: place.price_level || '💰💰',
      current_tier: place.current_tier || 'mamadei',
      quote: place.quote || '',
      is_requested: Boolean(place.is_requested),
    });
    setShowModal(true);
  }

  async function handleDeletePlace(id: string) {
    if (!confirm('Are you sure you want to permanently delete this place from the game?')) return;
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchAdminData();
  }

  async function handleSavePlace(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category,
      area: formData.area,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      price_level: formData.price_level,
      current_tier: formData.current_tier,
      quote: formData.quote,
      is_requested: formData.is_requested,
    };

    if (editingId) {
      const { error } = await supabase.from('places').update(payload).eq('id', editingId);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('places').insert([payload]);
      if (error) alert(error.message);
    }

    setShowModal(false);
    fetchAdminData();
  }

  // Render blank screen until security authorization passes
  if (!authorized) {
    return (
      <div className="flex-1 bg-bau-cream flex items-center justify-center font-baloo font-bold text-gray-500">
        🔐 Checking Credentials...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-hidden">
      {/* Header */}
      <div className="bg-bau-black text-bau-cream p-5 pt-[calc(env(safe-area-inset-top,44px)+16px)] border-b-[2.5px] border-bau-black flex items-center gap-3 shrink-0">
        <button onClick={() => router.push('/profile')} className="w-9 h-9 rounded-xl bg-bau-cream text-bau-black border-[2.5px] border-bau-black font-extrabold text-sm flex items-center justify-center shadow-bau-sm active:translate-x-0.5 active:translate-y-0.5">
          ←
        </button>
        <h1 className="font-baloo font-extrabold text-xl">⚙️ Admin Console</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b-[2.5px] border-bau-black shrink-0 bg-white">
        <button
          onClick={() => setActiveTab('places')}
          className={`flex-1 py-3 font-baloo font-extrabold text-sm border-r-[2.5px] border-bau-black ${activeTab === 'places' ? 'bg-bau-yellow text-bau-black' : 'text-gray-500'}`}
        >
          📍 Manage Places ({places.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-3 font-baloo font-extrabold text-sm ${activeTab === 'requests' ? 'bg-bau-yellow text-bau-black' : 'text-gray-500'}`}
        >
          📥 Requests ({requests.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-bau-cream">
        {loading ? (
          <div className="text-center font-baloo font-bold text-gray-500 my-8">Syncing database...</div>
        ) : (
          <>
            {/* TAB 1: PLACES DIRECTORY */}
            {activeTab === 'places' && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={openCreateModal}
                  className="bg-bau-blue text-white font-baloo font-extrabold text-sm py-3 rounded-xl border-[2.5px] border-bau-black shadow-bau active:translate-x-0.5 active:translate-y-0.5 mb-2"
                >
                  + Create New Place
                </button>

                {places.map((p) => (
                  <div key={p.id} className="bg-white border-[2.5px] border-bau-black rounded-2xl p-4 shadow-bau-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-baloo font-extrabold text-base text-bau-black leading-tight">{p.name}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{p.area} · {p.category}</p>
                      </div>
                      <div className="bg-bau-dim border border-bau-black font-baloo font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                        {p.current_tier === 'jengggg' ? '🔥 Jengggg' : p.current_tier === 'hociakk' ? '🤤 Hociakk' : p.current_tier === 'mamadei' ? '😐 Ma Ma Dei' : '🤨 Hmmm'}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 border-t border-gray-100 pt-3 mt-1">
                      <button onClick={() => openEditModal(p)} className="flex-1 bg-bau-yellow text-bau-black border-[1.5px] border-bau-black font-baloo font-extrabold text-xs py-1.5 rounded-lg shadow-bau-sm active:translate-x-0.5 active:translate-y-0.5">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDeletePlace(p.id)} className="bg-red-50 text-bau-red border-[1.5px] border-bau-black font-baloo font-extrabold text-xs px-3 py-1.5 rounded-lg active:translate-x-0.5 active:translate-y-0.5">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: HUNT REQUESTS */}
            {activeTab === 'requests' && (
              <div className="flex flex-col gap-3">
                {requests.length === 0 ? (
                  <div className="bg-white border-[2.5px] border-bau-black rounded-2xl p-6 text-center text-xs text-gray-500 shadow-bau-sm">Queue empty!</div>
                ) : (
                  requests.map((r, idx) => (
                    <div key={r.id} className="bg-white border-[2.5px] border-bau-black rounded-2xl p-4 shadow-bau-sm">
                      <div className="flex justify-between items-start mb-2">
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
                        <button onClick={() => handleApproveRequest(r)} className="flex-1 bg-bau-green text-white border-[1.5px] border-bau-black font-baloo font-extrabold text-xs py-1.5 rounded-lg shadow-bau-sm active:translate-x-0.5 active:translate-y-0.5">
                          ✅ Approve
                        </button>
                        <button onClick={() => handleDeleteRequest(r.id)} className="bg-red-50 text-bau-red border-[1.5px] border-bau-black font-baloo font-extrabold text-xs px-3 py-1.5 rounded-lg active:translate-x-0.5 active:translate-y-0.5">
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* CRUD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-bau-cream border-[2.5px] border-bau-black rounded-3xl p-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-baloo font-extrabold text-lg">{editingId ? '✏️ Edit Place' : '📍 New Place'}</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-full bg-white border border-bau-black font-bold text-xs">✕</button>
            </div>

            <form onSubmit={handleSavePlace} className="flex flex-col gap-3">
              <div>
                <label className="block font-baloo font-extrabold text-xs mb-1">Place Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2 text-xs font-semibold outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2 text-xs font-semibold outline-none">
                    <option value="Street Food">Street Food</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Area</label>
                  <input required type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2 text-xs font-semibold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Latitude</label>
                  <input required type="number" step="any" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2 text-xs font-semibold outline-none" />
                </div>
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Longitude</label>
                  <input required type="number" step="any" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2 text-xs font-semibold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Price Level</label>
                  <select value={formData.price_level} onChange={e => setFormData({...formData, price_level: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2 text-xs font-semibold outline-none">
                    <option value="💰">💰 Cheap</option>
                    <option value="💰💰">💰💰 Medium</option>
                    <option value="💰💰💰">💰💰💰 Expensive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-baloo font-extrabold text-xs mb-1">Rating Tier</label>
                  <select value={formData.current_tier} onChange={e => setFormData({...formData, current_tier: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2 text-xs font-semibold outline-none">
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
                <textarea rows={3} value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="w-full bg-white border-[2px] border-bau-black rounded-xl p-2 text-xs font-semibold outline-none resize-none" />
              </div>

              <label className="flex items-center gap-2 font-baloo font-extrabold text-xs cursor-pointer">
                <input type="checkbox" checked={formData.is_requested} onChange={e => setFormData({...formData, is_requested: e.target.checked})} className="w-4 h-4" />
                Flag as "Requested by Community" (Grey Pin)
              </label>

              <button type="submit" className="mt-2 bg-bau-blue text-white py-3 rounded-xl font-baloo font-extrabold text-sm border-[2.5px] border-bau-black shadow-bau active:translate-x-0.5 active:translate-y-0.5">
                💾 Save Place
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
