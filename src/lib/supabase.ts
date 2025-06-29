import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface ServiceContact {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  service_name: string;
  role: 'Lead' | 'Participant';
  experience?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
}