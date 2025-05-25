-- SQL Script to initialize restaurant tables
-- This script adds default tables with various capacities for the restaurant

INSERT INTO tables (table_number, capacity, location, is_active, is_reservable)
VALUES 
  ('T1', 2, 'Window', true, true),
  ('T2', 2, 'Window', true, true),
  ('T3', 4, 'Main Floor', true, true),
  ('T4', 4, 'Main Floor', true, true),
  ('T5', 4, 'Window', true, true),
  ('T6', 6, 'Patio', true, true),
  ('T7', 6, 'Patio', true, true),
  ('T8', 8, 'Private Area', true, true),
  ('T9', 8, 'Main Floor', true, true),
  ('T10', 10, 'Private Room', true, true),
  ('T11', 12, 'Banquet Hall', true, true),
  ('T12', 15, 'Banquet Hall', true, true);

-- Ensure we have at least one large table for parties over 10
-- Only insert if table doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tables WHERE table_number = 'T12') THEN
    INSERT INTO tables (table_number, capacity, location, is_active, is_reservable)
    VALUES ('T12', 15, 'Banquet Hall', true, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM tables WHERE table_number = 'T11') THEN
    INSERT INTO tables (table_number, capacity, location, is_active, is_reservable)
    VALUES ('T11', 12, 'Banquet Hall', true, true);
  END IF;
END $$;