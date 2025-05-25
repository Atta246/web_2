-- SQL script to identify and remove duplicate tables from the restaurant database
-- This helps fix the "No tables available" issue caused by duplicate table numbers

-- First, let's identify any duplicate tables
SELECT table_number, COUNT(*), array_agg(table_id) as table_ids
FROM tables
GROUP BY table_number
HAVING COUNT(*) > 1;

-- Create a temporary table to store the tables we want to keep
CREATE TEMP TABLE tables_to_keep AS
WITH ranked_tables AS (
  SELECT 
    *,
    ROW_NUMBER() OVER(PARTITION BY table_number ORDER BY table_id) as row_num
  FROM tables
)
SELECT table_id
FROM ranked_tables
WHERE row_num = 1;

-- Backup reservations that might be affected
CREATE TABLE IF NOT EXISTS reservation_backups AS
SELECT * FROM reservations WHERE false;

-- Back up reservations that reference tables being deleted
INSERT INTO reservation_backups
SELECT r.*
FROM reservations r
JOIN tables t ON r.table_id = t.table_id
WHERE t.table_id NOT IN (SELECT table_id FROM tables_to_keep)
  AND r.status != 'cancelled';

-- Update the table_id for affected reservations to point to the surviving tables
WITH reservation_updates AS (
  SELECT 
    r.reservation_id,
    r.table_id as old_table_id,
    (
      SELECT k.table_id
      FROM tables k
      JOIN tables_to_keep tk ON k.table_id = tk.table_id
      WHERE k.table_number = (SELECT table_number FROM tables WHERE table_id = r.table_id)
      LIMIT 1
    ) as new_table_id
  FROM reservations r
  WHERE r.table_id NOT IN (SELECT table_id FROM tables_to_keep)
    AND r.status != 'cancelled'
)
UPDATE reservations r
SET table_id = ru.new_table_id
FROM reservation_updates ru
WHERE r.reservation_id = ru.reservation_id
  AND ru.new_table_id IS NOT NULL;

-- Delete duplicate tables, keeping only one instance of each table number
DELETE FROM tables
WHERE table_id NOT IN (SELECT table_id FROM tables_to_keep);

-- Drop the temporary table
DROP TABLE tables_to_keep;

-- Count the remaining tables to confirm duplicates are removed
SELECT COUNT(*) as remaining_tables_count FROM tables;

-- Verify that each table_number is now unique
SELECT table_number, COUNT(*) 
FROM tables 
GROUP BY table_number 
HAVING COUNT(*) > 1;
