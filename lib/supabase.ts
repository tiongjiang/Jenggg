import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qxrrmxmsetojcuwpiakb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jSExQEravCee_SxDPDwMPg_O8woJpRB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Place = {
  id: string;
  name: string;
  category: string;
  area: string;
  lat: number;
  lng: number;
  price_level: string;
  current_tier: 'jengggg' | 'hociakk' | 'mamadei' | 'hmmm' | 'ewww' | null;
  quote: string;
  description: string;
  is_requested: boolean;
  request_count: number;
};

export type HuntRequest = {
  id: string;
  name: string;
  area: string;
  category: string;
  hunt_count: number;
  status: 'pending' | 'planned' | 'hunted';
};
