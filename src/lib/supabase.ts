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

export interface ServiceLeader {
  id: string;
  service_id: string;
  user_id: string;
  position: number;
  assigned_at: string;
  assigned_by?: string;
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

// ============================================
// LEARNING MODULE TYPES
// ============================================

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type StepType = 'text' | 'video' | 'audio' | 'qcm' | 'exercise';
export type QCMQuestionType = 'single' | 'multiple';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type BadgeConditionType = 'steps_completed' | 'courses_completed' | 'perfect_score' | 'streak_days' | 'first_step';

export interface Course {
  id: string;
  teacher_id?: string;
  title: string;
  description?: string;
  image_url?: string;
  category: string;
  difficulty_level: DifficultyLevel;
  estimated_duration: number;
  is_published: boolean;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at?: string;
}

export interface LearningPath {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  is_required: boolean;
  estimated_duration: number;
  created_at: string;
  updated_at?: string;
}

export interface LearningStep {
  id: string;
  path_id: string;
  title: string;
  step_type: StepType;
  content: StepContent;
  order_index: number;
  estimated_duration: number;
  points: number;
  created_at: string;
  updated_at?: string;
}

export interface StepContent {
  text?: string;
  video_url?: string;
  audio_url?: string;
  html?: string;
  instructions?: string;
}

export interface QCMQuestion {
  id: string;
  step_id: string;
  question: string;
  question_type: QCMQuestionType;
  explanation?: string;
  points: number;
  order_index: number;
  created_at: string;
}

export interface QCMOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  feedback?: string;
  order_index: number;
  created_at: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  last_accessed_at: string;
}

export interface StepProgress {
  id: string;
  user_id: string;
  step_id: string;
  status: ProgressStatus;
  score: number;
  attempts: number;
  time_spent: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface QCMAnswer {
  id: string;
  user_id: string;
  question_id: string;
  selected_options: string[];
  is_correct: boolean;
  answered_at: string;
  attempt_number: number;
}

export interface LearningBadge {
  id: string;
  name: string;
  description?: string;
  icon: string;
  condition_type: BadgeConditionType;
  condition_value: number;
  points: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface UserLearningStats {
  id: string;
  user_id: string;
  total_points: number;
  total_steps_completed: number;
  total_courses_completed: number;
  total_qcm_answered: number;
  total_perfect_scores: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  created_at: string;
  updated_at?: string;
}

// Types enrichis avec relations
export interface CourseWithDetails extends Course {
  teacher?: Profile;
  paths?: LearningPathWithSteps[];
  enrollment?: CourseEnrollment;
}

export interface LearningPathWithSteps extends LearningPath {
  steps?: LearningStepWithProgress[];
}

export interface LearningStepWithProgress extends LearningStep {
  progress?: StepProgress;
  questions?: QCMQuestionWithOptions[];
}

export interface QCMQuestionWithOptions extends QCMQuestion {
  options?: QCMOption[];
}