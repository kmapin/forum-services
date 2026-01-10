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

// Type pour les demandes de service de conciergerie
export interface ServiceRequestDB {
  id: string;
  service_id: string;
  service_name: string;
  service_slug: string;
  last_name: string;
  first_name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Types pour ChurchApp
export interface About {
  id: string;
  title: string;
  description: string;
  image_url: string;
  mission?: string;
  vision?: string;
  values?: string[];
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  created_at: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  image_url?: string;
  youtube_url?: string;
  created_at: string;
  updated_at?: string;
}

export type MeetingType = 'prayer' | 'bible_study' | 'youth' | 'teens' | 'house_groups' | 'intercession' | 'flames' | 'support';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  type: MeetingType;
  day_of_week?: string;
  time?: string;
  location?: string;
  is_active: boolean;
  contact_1_name?: string;
  contact_1_email?: string;
  contact_1_phone?: string;
  contact_1_info?: string;
  contact_2_name?: string;
  contact_2_email?: string;
  contact_2_phone?: string;
  contact_2_info?: string;
  contact_3_name?: string;
  contact_3_email?: string;
  contact_3_phone?: string;
  contact_3_info?: string;
  created_at: string;
  updated_at?: string;
}

export interface WelcomeMessage {
  id: string;
  title: string;
  message: string;
  image_url?: string;
  cta_text: string;
  cta_action: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type PlanningStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface Planning {
  id: string;
  service_id: string;
  date: string;
  task: string;
  status: PlanningStatus;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface PlanningAssignment {
  id: string;
  planning_id: string;
  member_id: string;
  individual_status: PlanningStatus;
  assigned_at: string;
  completed_at?: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  created_at: string;
  updated_at?: string;
}

export interface ServiceMember {
  id: string;
  service_id: string;
  user_id: string;
  joined_at: string;
  added_by?: string;
  status: 'active' | 'inactive';
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  emoji?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}