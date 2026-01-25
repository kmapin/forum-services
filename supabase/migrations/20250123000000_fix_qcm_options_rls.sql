-- ============================================
-- FIX: Corriger les policies RLS pour qcm_options
-- Le timeout indique un problème de performance dans les policies
-- ============================================

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "qcm_options_select" ON qcm_options;
DROP POLICY IF EXISTS "qcm_options_insert" ON qcm_options;
DROP POLICY IF EXISTS "qcm_options_update" ON qcm_options;
DROP POLICY IF EXISTS "qcm_options_delete" ON qcm_options;

-- Créer des policies optimisées et simples
-- Lecture publique pour tous (les options de QCM ne sont pas sensibles)
CREATE POLICY "qcm_options_select" ON qcm_options
  FOR SELECT
  USING (true);

-- Seuls les enseignants peuvent modifier
CREATE POLICY "qcm_options_insert" ON qcm_options
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM qcm_questions q
      JOIN learning_steps s ON s.id = q.step_id
      JOIN learning_paths p ON p.id = s.path_id
      JOIN courses c ON c.id = p.course_id
      JOIN profiles prof ON prof.id = c.teacher_id
      WHERE q.id = qcm_options.question_id
      AND prof.id = auth.uid()
      AND prof.role IN ('admin', 'teacher', 'pastor', 'leader')
    )
  );

CREATE POLICY "qcm_options_update" ON qcm_options
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM qcm_questions q
      JOIN learning_steps s ON s.id = q.step_id
      JOIN learning_paths p ON p.id = s.path_id
      JOIN courses c ON c.id = p.course_id
      JOIN profiles prof ON prof.id = c.teacher_id
      WHERE q.id = qcm_options.question_id
      AND prof.id = auth.uid()
      AND prof.role IN ('admin', 'teacher', 'pastor', 'leader')
    )
  );

CREATE POLICY "qcm_options_delete" ON qcm_options
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM qcm_questions q
      JOIN learning_steps s ON s.id = q.step_id
      JOIN learning_paths p ON p.id = s.path_id
      JOIN courses c ON c.id = p.course_id
      JOIN profiles prof ON prof.id = c.teacher_id
      WHERE q.id = qcm_options.question_id
      AND prof.id = auth.uid()
      AND prof.role IN ('admin', 'teacher', 'pastor', 'leader')
    )
  );

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_qcm_options_question_id ON qcm_options(question_id);
CREATE INDEX IF NOT EXISTS idx_qcm_questions_step_id ON qcm_questions(step_id);
