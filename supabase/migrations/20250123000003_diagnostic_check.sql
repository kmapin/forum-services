-- ============================================
-- DIAGNOSTIC: Check RLS policies and data
-- ============================================

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('user_learning_stats', 'user_badges');

-- Check existing policies on user_learning_stats
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_learning_stats';

-- Check existing policies on user_badges
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_badges';

-- Check if user has any stats records (replace with your actual user_id)
-- SELECT * FROM user_learning_stats WHERE user_id = 'YOUR_USER_ID';

-- Check if user has any badge records (replace with your actual user_id)
-- SELECT * FROM user_badges WHERE user_id = 'YOUR_USER_ID';
