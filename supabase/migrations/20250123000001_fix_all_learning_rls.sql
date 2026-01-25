-- ============================================
-- FIX: Corriger toutes les policies RLS du module Learning
-- ============================================

-- ============================================
-- 1. QCM_OPTIONS - Lecture publique
-- ============================================
DROP POLICY IF EXISTS "qcm_options_select" ON qcm_options;
CREATE POLICY "qcm_options_select" ON qcm_options
  FOR SELECT
  USING (true);

-- ============================================
-- 2. QCM_QUESTIONS - Lecture publique
-- ============================================
DROP POLICY IF EXISTS "qcm_questions_select" ON qcm_questions;
CREATE POLICY "qcm_questions_select" ON qcm_questions
  FOR SELECT
  USING (true);

-- ============================================
-- 3. LEARNING_STEPS - Lecture publique
-- ============================================
DROP POLICY IF EXISTS "learning_steps_select" ON learning_steps;
CREATE POLICY "learning_steps_select" ON learning_steps
  FOR SELECT
  USING (true);

-- ============================================
-- 4. LEARNING_PATHS - Lecture publique
-- ============================================
DROP POLICY IF EXISTS "learning_paths_select" ON learning_paths;
CREATE POLICY "learning_paths_select" ON learning_paths
  FOR SELECT
  USING (true);

-- ============================================
-- 5. COURSES - Lecture publique pour les cours publiés
-- ============================================
DROP POLICY IF EXISTS "courses_select" ON courses;
CREATE POLICY "courses_select" ON courses
  FOR SELECT
  USING (is_published = true OR teacher_id = auth.uid());

-- ============================================
-- 6. STEP_PROGRESS - Les utilisateurs gèrent leur propre progression
-- ============================================
DROP POLICY IF EXISTS "step_progress_select" ON step_progress;
DROP POLICY IF EXISTS "step_progress_insert" ON step_progress;
DROP POLICY IF EXISTS "step_progress_update" ON step_progress;
DROP POLICY IF EXISTS "step_progress_delete" ON step_progress;

CREATE POLICY "step_progress_select" ON step_progress
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "step_progress_insert" ON step_progress
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "step_progress_update" ON step_progress
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "step_progress_delete" ON step_progress
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- 7. QCM_ANSWERS - Les utilisateurs gèrent leurs propres réponses
-- ============================================
DROP POLICY IF EXISTS "qcm_answers_select" ON qcm_answers;
DROP POLICY IF EXISTS "qcm_answers_insert" ON qcm_answers;
DROP POLICY IF EXISTS "qcm_answers_update" ON qcm_answers;
DROP POLICY IF EXISTS "qcm_answers_delete" ON qcm_answers;

CREATE POLICY "qcm_answers_select" ON qcm_answers
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "qcm_answers_insert" ON qcm_answers
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "qcm_answers_update" ON qcm_answers
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "qcm_answers_delete" ON qcm_answers
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- 8. COURSE_ENROLLMENTS - Les utilisateurs gèrent leurs inscriptions
-- ============================================
DROP POLICY IF EXISTS "course_enrollments_select" ON course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_insert" ON course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_update" ON course_enrollments;
DROP POLICY IF EXISTS "course_enrollments_delete" ON course_enrollments;

CREATE POLICY "course_enrollments_select" ON course_enrollments
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "course_enrollments_insert" ON course_enrollments
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "course_enrollments_update" ON course_enrollments
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "course_enrollments_delete" ON course_enrollments
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- 9. Créer les index manquants pour les performances
-- ============================================
CREATE INDEX IF NOT EXISTS idx_qcm_options_question_id ON qcm_options(question_id);
CREATE INDEX IF NOT EXISTS idx_qcm_questions_step_id ON qcm_questions(step_id);
CREATE INDEX IF NOT EXISTS idx_learning_steps_path_id ON learning_steps(path_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_course_id ON learning_paths(course_id);
CREATE INDEX IF NOT EXISTS idx_step_progress_user_id ON step_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_step_progress_step_id ON step_progress(step_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
