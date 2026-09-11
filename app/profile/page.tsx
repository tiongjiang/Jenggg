'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { TrainerBoy } from '@/components/TrainerBoy';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url,
        });
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setAuthInProgress(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback?next=/profile` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login error';
      alert(msg);
      setAuthInProgress(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const badges = [
    { id: '1', name: 'Noodle Hunter', icon: '🍜', unlocked: true },
    { id: '2', name: 'Kopitiam Hero', icon: '☕', unlocked: true },
    { id: '3', name: 'Spicy Legend', icon: '🔥', unlocked: true },
    { id: '4', name: 'Night Hunter', icon: '🌙', unlocked: true },
    { id: '5', name: 'Hidden Gem', icon: '💎', unlocked: Boolean(user) },
    { id: '6', name: 'Veteran Scout', icon: '🏆', unlocked: Boolean(user) },
    { id: '7', name: 'Party Host', icon: '👥', unlocked: false },
    { id: '8', name: 'KL Gourmet', icon: '👑', unlocked: Boolean(user) },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-bau-cream overflow-hidden">
      {/* Profile Header */}
      <div className="bg-bau-blue text-white p-5 pt-[calc(env(safe-area-inset-top,44px)+16px)] border-b-[2.5px] border-bau-black text-center flex flex-col items-center shrink-0">
        
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl bg-bau-yellow border-[2.5px] border-bau-black shadow-bau flex items-center justify-center mb-2.5 overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="scale-125">
              <TrainerBoy />
            </div>
          )}
        </div>

        {/* User Identity or Login prompt */}
        {loading ? (
          <div className="font-baloo font-bold text-sm text-blue-200">Loading hunter profile...</div>
        ) : user ? (
          <>
            <h2 className="font-baloo font-extrabold text-2xl leading-tight text-white">{user.name}</h2>
            <p className="text-xs font-medium text-blue-100">{user.email}</p>
            <div className="w-48 h-2 bg-black/25 rounded-full overflow-hidden border border-bau-black my-2">
              <div className="h-full bg-bau-yellow w-[82%]" />
            </div>
            <p className="text-[11px] font-semibold text-blue-100">820 / 1000 XP to Level 9</p>
          </>
        ) : (
          <div className="mt-1 flex flex-col items-center">
            <h2 className="font-baloo font-extrabold text-xl leading-tight">Guest Hunter</h2>
            <p className="text-xs text-blue-100 mb-3">Sign in to save your favorite spots & badges across devices.</p>
            <button
              onClick={handleGoogleLogin}
              disabled={authInProgress}
              className="bg-white text-bau-black border-[2px] border-bau-black rounded-xl px-4 py-2 font-baloo font-extrabold text-xs shadow-bau-sm flex items-center gap-2 active:scale-95 transition-transform"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
              </svg>
              <span>{authInProgress ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="flex gap-3 mt-3">
          <div className="bg-white/15 border border-bau-black rounded-xl px-4 py-1.5 shadow-bau-sm">
            <div className="font-baloo font-extrabold text-base">24</div>
            <div className="text-[10px] font-semibold text-blue-100">Hunts</div>
          </div>
          <div className="bg-white/15 border border-bau-black rounded-xl px-4 py-1.5 shadow-bau-sm">
            <div className="font-baloo font-extrabold text-base">18</div>
            <div className="text-[10px] font-semibold text-blue-100">Saved</div>
          </div>
          <div className="bg-white/15 border border-bau-black rounded-xl px-4 py-1.5 shadow-bau-sm">
            <div className="font-baloo font-extrabold text-base">6</div>
            <div className="text-[10px] font-semibold text-blue-100">Badges</div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
        <div>
          <div className="font-baloo font-extrabold text-xs uppercase tracking-wider text-bau-black mb-3">
            🏅 Hunter Badges
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`border-[2.5px] border-bau-black rounded-xl p-2.5 text-center shadow-bau-sm ${
                  b.unlocked ? 'bg-white' : 'bg-gray-200 opacity-40'
                }`}
              >
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className="font-baloo font-bold text-[10px] leading-tight text-bau-black truncate">
                  {b.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {user && (
          <div className="pt-4 pb-2">
            <button
              onClick={handleSignOut}
              className="w-full bg-white text-bau-red border-[2px] border-bau-black py-2.5 rounded-xl font-baloo font-extrabold text-xs shadow-bau-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform"
            >
              Sign Out ({user.email})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
