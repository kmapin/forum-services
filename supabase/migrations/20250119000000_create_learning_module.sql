-- ============================================
-- LEARNING MODULE - Migration SQL
-- Module de formation en ligne
-- ============================================

-- ============================================
-- 1. TABLES PRINCIPALES
-- ============================================

-- Table des cours/formations
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'general',
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration INTEGER DEFAULT 0, -- en minutes
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des parcours pédagogiques (chapitres d'un cours)
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT TRUE,
  estimated_duration INTEGER DEFAULT 0, -- en minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des étapes pédagogiques (leçons d'un parcours)
CREATE TABLE IF NOT EXISTS learning_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('text', 'video', 'audio', 'qcm', 'exercise')),
  content JSONB DEFAULT '{}', -- Contenu flexible selon le type
  order_index INTEGER DEFAULT 0,
  estimated_duration INTEGER DEFAULT 5, -- en minutes
  points INTEGER DEFAULT 10, -- Points attribués à la complétion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. TABLES QCM
-- ============================================

-- Table des questions QCM
CREATE TABLE IF NOT EXISTS qcm_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id UUID REFERENCES learning_steps(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'single' CHECK (question_type IN ('single', 'multiple')),
  explanation TEXT, -- Explication affichée après réponse
  points INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table des options de réponse QCM
CREATE TABLE IF NOT EXISTS qcm_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES qcm_questions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  feedback TEXT, -- Feedback spécifique à cette option
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- 3. TABLES PROGRESSION ÉTUDIANT
-- ============================================

-- Table des inscriptions aux cours
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Table de progression par étape
CREATE TABLE IF NOT EXISTS step_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  step_id UUID REFERENCES learning_steps(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- en secondes
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, step_id)
);

-- Table des réponses aux QCM
CREATE TABLE IF NOT EXISTS qcm_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES qcm_questions(id) ON DELETE CASCADE NOT NULL,
  selected_options UUID[] NOT NULL, -- IDs des options sélectionnées
  is_correct BOOLEAN DEFAULT FALSE,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  attempt_number INTEGER DEFAULT 1
);

-- ============================================
-- 4. TABLES LUDIFICATION
-- ============================================

-- Table des badges
CREATE TABLE IF NOT EXISTS learning_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL, -- Emoji ou URL d'icône
  condition_type TEXT NOT NULL CHECK (condition_type IN ('steps_completed', 'courses_completed', 'perfect_score', 'streak_days', 'first_step')),
  condition_value INTEGER DEFAULT 1, -- Valeur à atteindre
  points INTEGER DEFAULT 50, -- Points bonus
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table des badges obtenus par les utilisateurs
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES learning_badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, badge_id)
);

-- Table des statistiques utilisateur (pour la ludification)
CREATE TABLE IF NOT EXISTS user_learning_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  total_steps_completed INTEGER DEFAULT 0,
  total_courses_completed INTEGER DEFAULT 0,
  total_qcm_answered INTEGER DEFAULT 0,
  total_perfect_scores INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE qcm_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qcm_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE qcm_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_stats ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. POLICIES - COURSES
-- ============================================

-- Tout le monde peut voir les cours publiés
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (is_published = TRUE);

-- Les enseignants peuvent voir tous leurs cours
CREATE POLICY "Teachers can view their own courses" ON courses
  FOR SELECT USING (teacher_id = auth.uid());

-- Les enseignants et admins peuvent créer des cours
CREATE POLICY "Teachers can create courses" ON courses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'pastor', 'leader', 'teacher')
    )
  );

-- Les enseignants peuvent modifier leurs propres cours
CREATE POLICY "Teachers can update their own courses" ON courses
  FOR UPDATE USING (teacher_id = auth.uid());

-- Les enseignants peuvent supprimer leurs propres cours
CREATE POLICY "Teachers can delete their own courses" ON courses
  FOR DELETE USING (teacher_id = auth.uid());

-- ============================================
-- 7. POLICIES - PATHS & STEPS
-- ============================================

-- Tout le monde peut voir les parcours des cours publiés
CREATE POLICY "Anyone can view paths of published courses" ON learning_paths
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = learning_paths.course_id 
      AND courses.is_published = TRUE
    )
    OR
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = learning_paths.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Les enseignants peuvent gérer les parcours de leurs cours
CREATE POLICY "Teachers can manage their paths" ON learning_paths
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = learning_paths.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Tout le monde peut voir les étapes des cours publiés
CREATE POLICY "Anyone can view steps of published courses" ON learning_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM learning_paths lp
      JOIN courses c ON c.id = lp.course_id
      WHERE lp.id = learning_steps.path_id 
      AND (c.is_published = TRUE OR c.teacher_id = auth.uid())
    )
  );

-- Les enseignants peuvent gérer les étapes de leurs cours
CREATE POLICY "Teachers can manage their steps" ON learning_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM learning_paths lp
      JOIN courses c ON c.id = lp.course_id
      WHERE lp.id = learning_steps.path_id 
      AND c.teacher_id = auth.uid()
    )
  );

-- ============================================
-- 8. POLICIES - QCM
-- ============================================

-- Tout le monde peut voir les questions des cours publiés
CREATE POLICY "Anyone can view qcm questions" ON qcm_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM learning_steps ls
      JOIN learning_paths lp ON lp.id = ls.path_id
      JOIN courses c ON c.id = lp.course_id
      WHERE ls.id = qcm_questions.step_id 
      AND (c.is_published = TRUE OR c.teacher_id = auth.uid())
    )
  );

-- Les enseignants peuvent gérer les questions de leurs cours
CREATE POLICY "Teachers can manage qcm questions" ON qcm_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM learning_steps ls
      JOIN learning_paths lp ON lp.id = ls.path_id
      JOIN courses c ON c.id = lp.course_id
      WHERE ls.id = qcm_questions.step_id 
      AND c.teacher_id = auth.uid()
    )
  );

-- Policies similaires pour qcm_options
CREATE POLICY "Anyone can view qcm options" ON qcm_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM qcm_questions qq
      JOIN learning_steps ls ON ls.id = qq.step_id
      JOIN learning_paths lp ON lp.id = ls.path_id
      JOIN courses c ON c.id = lp.course_id
      WHERE qq.id = qcm_options.question_id 
      AND (c.is_published = TRUE OR c.teacher_id = auth.uid())
    )
  );

CREATE POLICY "Teachers can manage qcm options" ON qcm_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM qcm_questions qq
      JOIN learning_steps ls ON ls.id = qq.step_id
      JOIN learning_paths lp ON lp.id = ls.path_id
      JOIN courses c ON c.id = lp.course_id
      WHERE qq.id = qcm_options.question_id 
      AND c.teacher_id = auth.uid()
    )
  );

-- ============================================
-- 9. POLICIES - PROGRESSION
-- ============================================

-- Les utilisateurs peuvent voir leurs propres inscriptions
CREATE POLICY "Users can view their enrollments" ON course_enrollments
  FOR SELECT USING (user_id = auth.uid());

-- Les enseignants peuvent voir les inscriptions à leurs cours
CREATE POLICY "Teachers can view enrollments to their courses" ON course_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_enrollments.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent s'inscrire aux cours
CREATE POLICY "Users can enroll in courses" ON course_enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Les utilisateurs peuvent mettre à jour leur propre progression
CREATE POLICY "Users can update their enrollment" ON course_enrollments
  FOR UPDATE USING (user_id = auth.uid());

-- Policies pour step_progress
CREATE POLICY "Users can manage their step progress" ON step_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Teachers can view step progress" ON step_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM learning_steps ls
      JOIN learning_paths lp ON lp.id = ls.path_id
      JOIN courses c ON c.id = lp.course_id
      WHERE ls.id = step_progress.step_id 
      AND c.teacher_id = auth.uid()
    )
  );

-- Policies pour qcm_answers
CREATE POLICY "Users can manage their qcm answers" ON qcm_answers
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Teachers can view qcm answers" ON qcm_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM qcm_questions qq
      JOIN learning_steps ls ON ls.id = qq.step_id
      JOIN learning_paths lp ON lp.id = ls.path_id
      JOIN courses c ON c.id = lp.course_id
      WHERE qq.id = qcm_answers.question_id 
      AND c.teacher_id = auth.uid()
    )
  );

-- ============================================
-- 10. POLICIES - LUDIFICATION
-- ============================================

-- Tout le monde peut voir les badges
CREATE POLICY "Anyone can view badges" ON learning_badges
  FOR SELECT USING (TRUE);

-- Seuls les admins peuvent gérer les badges
CREATE POLICY "Admins can manage badges" ON learning_badges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'pastor')
    )
  );

-- Les utilisateurs peuvent voir leurs propres badges
CREATE POLICY "Users can view their badges" ON user_badges
  FOR SELECT USING (user_id = auth.uid());

-- Le système peut attribuer des badges
CREATE POLICY "System can grant badges" ON user_badges
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Les utilisateurs peuvent voir leurs propres stats
CREATE POLICY "Users can manage their stats" ON user_learning_stats
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- 11. TRIGGERS
-- ============================================

-- Trigger pour updated_at sur courses
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour updated_at sur learning_paths
CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour updated_at sur learning_steps
CREATE TRIGGER update_learning_steps_updated_at
  BEFORE UPDATE ON learning_steps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour updated_at sur step_progress
CREATE TRIGGER update_step_progress_updated_at
  BEFORE UPDATE ON step_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger pour updated_at sur user_learning_stats
CREATE TRIGGER update_user_learning_stats_updated_at
  BEFORE UPDATE ON user_learning_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 12. DONNÉES INITIALES
-- ============================================

-- Badges par défaut
INSERT INTO learning_badges (name, description, icon, condition_type, condition_value, points) VALUES
  ('Premier Pas', 'Vous avez complété votre première étape !', '🎯', 'first_step', 1, 50),
  ('Explorateur', 'Vous avez complété 10 étapes', '🧭', 'steps_completed', 10, 100),
  ('Marathonien', 'Vous avez complété 50 étapes', '🏃', 'steps_completed', 50, 250),
  ('Perfectionniste', 'Vous avez obtenu un score parfait', '⭐', 'perfect_score', 1, 100),
  ('Expert', 'Vous avez obtenu 10 scores parfaits', '🏆', 'perfect_score', 10, 500),
  ('Diplômé', 'Vous avez terminé un cours complet', '🎓', 'courses_completed', 1, 200),
  ('Assidu', 'Vous avez étudié 7 jours consécutifs', '🔥', 'streak_days', 7, 150),
  ('Dévoué', 'Vous avez étudié 30 jours consécutifs', '💪', 'streak_days', 30, 500)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 13. INDEX POUR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_learning_paths_course_id ON learning_paths(course_id);
CREATE INDEX IF NOT EXISTS idx_learning_steps_path_id ON learning_steps(path_id);
CREATE INDEX IF NOT EXISTS idx_qcm_questions_step_id ON qcm_questions(step_id);
CREATE INDEX IF NOT EXISTS idx_qcm_options_question_id ON qcm_options(question_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_step_progress_user_id ON step_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_step_progress_step_id ON step_progress(step_id);
CREATE INDEX IF NOT EXISTS idx_qcm_answers_user_id ON qcm_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_qcm_answers_question_id ON qcm_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
