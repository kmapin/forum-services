-- Migration: Update Prayer Status System
-- Date: 2025-10-10
-- Description: Change prayer status from (active, answered, closed) to (active, suivre, archiver)

-- Step 1: Backup existing data
CREATE TABLE IF NOT EXISTS prayers_backup_20250110 AS 
SELECT * FROM prayers;

-- Step 2: Add new status values temporarily (allow both old and new)
ALTER TABLE prayers 
DROP CONSTRAINT IF EXISTS prayers_status_check;

ALTER TABLE prayers
ADD CONSTRAINT prayers_status_check 
CHECK (status IN ('active', 'suivre', 'archiver', 'answered', 'closed'));

-- Step 3: Migrate existing data
-- Convert 'answered' and 'closed' to 'archiver'
UPDATE prayers 
SET status = 'archiver' 
WHERE status IN ('answered', 'closed');

-- Step 4: Remove old status values from constraint
ALTER TABLE prayers 
DROP CONSTRAINT prayers_status_check;

ALTER TABLE prayers
ADD CONSTRAINT prayers_status_check 
CHECK (status IN ('active', 'suivre', 'archiver'));

-- Step 5: Add comment for documentation
COMMENT ON COLUMN prayers.status IS 'Prayer status: active (new), suivre (follow-up), archiver (archived/completed)';

-- Step 6: Verification query
DO $$
DECLARE
    active_count INTEGER;
    suivre_count INTEGER;
    archiver_count INTEGER;
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO active_count FROM prayers WHERE status = 'active';
    SELECT COUNT(*) INTO suivre_count FROM prayers WHERE status = 'suivre';
    SELECT COUNT(*) INTO archiver_count FROM prayers WHERE status = 'archiver';
    SELECT COUNT(*) INTO total_count FROM prayers;
    
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Active prayers: %', active_count;
    RAISE NOTICE 'Suivre prayers: %', suivre_count;
    RAISE NOTICE 'Archiver prayers: %', archiver_count;
    RAISE NOTICE 'Total prayers: %', total_count;
END $$;

-- Step 7: Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_prayers_status ON prayers(status);
CREATE INDEX IF NOT EXISTS idx_prayers_status_created_at ON prayers(status, created_at DESC);

-- Rollback script (if needed):
-- 
-- -- Restore old status values
-- ALTER TABLE prayers DROP CONSTRAINT prayers_status_check;
-- ALTER TABLE prayers ADD CONSTRAINT prayers_status_check CHECK (status IN ('active', 'answered', 'closed', 'suivre', 'archiver'));
-- 
-- -- Convert back
-- UPDATE prayers SET status = 'closed' WHERE status = 'archiver';
-- UPDATE prayers SET status = 'answered' WHERE status = 'suivre';
-- 
-- -- Remove new status values
-- ALTER TABLE prayers DROP CONSTRAINT prayers_status_check;
-- ALTER TABLE prayers ADD CONSTRAINT prayers_status_check CHECK (status IN ('active', 'answered', 'closed'));
-- 
-- -- Restore from backup if needed
-- -- TRUNCATE prayers;
-- -- INSERT INTO prayers SELECT * FROM prayers_backup_20250110;
