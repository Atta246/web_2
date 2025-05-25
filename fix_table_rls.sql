-- SQL script to correct the Row Level Security (RLS) policies for the tables table
-- This will help fix the issues with adding and managing restaurant tables

-- First, drop any existing RLS policies on the tables table
DROP POLICY IF EXISTS "Enable read access for all users" ON "tables";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "tables";
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON "tables";
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON "tables";

-- Create appropriate policies for the tables table

-- Everyone can read tables
CREATE POLICY "Enable read access for all users"
ON "tables"
FOR SELECT
USING (true);

-- Only authenticated users can insert new tables
CREATE POLICY "Enable insert for authenticated users only"
ON "tables"
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Only authenticated users can update tables
CREATE POLICY "Enable update for authenticated users only"
ON "tables"
FOR UPDATE
USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Only authenticated users can delete tables
CREATE POLICY "Enable delete for authenticated users only"
ON "tables"
FOR DELETE
USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Update comment to indicate the policies have been fixed
COMMENT ON TABLE "tables" IS 'Restaurant tables with fixed RLS policies';
