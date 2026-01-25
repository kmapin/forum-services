-- ============================================
-- FIX: Add missing RLS policies for user_learning_stats and user_badges
-- ============================================

-- ============================================
-- 1. USER_LEARNING_STATS - Les utilisateurs gèrent leurs statistiques
-- ============================================
DROP POLICY IF EXISTS "Users can manage their stats" ON user_learning_stats;
DROP POLICY IF EXISTS "user_learning_stats_select" ON user_learning_stats;
DROP POLICY IF EXISTS "user_learning_stats_insert" ON user_learning_stats;
DROP POLICY IF EXISTS "user_learning_stats_update" ON user_learning_stats;
DROP POLICY IF EXISTS "user_learning_stats_delete" ON user_learning_stats;

CREATE POLICY "user_learning_stats_select" ON user_learning_stats
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_learning_stats_insert" ON user_learning_stats
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_learning_stats_update" ON user_learning_stats
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "user_learning_stats_delete" ON user_learning_stats
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- 2. USER_BADGES - Les utilisateurs voient leurs badges
-- ============================================
DROP POLICY IF EXISTS "Users can view their badges" ON user_badges;
DROP POLICY IF EXISTS "System can grant badges" ON user_badges;
DROP POLICY IF EXISTS "user_badges_select" ON user_badges;
DROP POLICY IF EXISTS "user_badges_insert" ON user_badges;

CREATE POLICY "user_badges_select" ON user_badges
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_badges_insert" ON user_badges
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- 3. Add missing indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_learning_stats_user_id ON user_learning_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_qcm_answers_user_id ON qcm_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_qcm_answers_question_id ON qcm_answers(question_id);
