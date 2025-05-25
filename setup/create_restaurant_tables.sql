-- SQL script to create restaurant reservation tables in Supabase
-- This script creates a complete schema for a restaurant reservation system

BEGIN;

-- Customer profiles table - supports both registered and guest users
CREATE TABLE IF NOT EXISTS customer_profiles (
    profile_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID, -- NULL for guest users, links to auth.users for registered users
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    preferences TEXT,
    loyalty_points INT DEFAULT 0,
    is_guest BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tables in the restaurant
CREATE TABLE IF NOT EXISTS tables (
    table_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_number VARCHAR(10) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    location VARCHAR(50), -- e.g., 'window', 'patio', 'private room'
    is_active BOOLEAN DEFAULT TRUE,
    is_reservable BOOLEAN DEFAULT TRUE,
    min_party_size INT DEFAULT 1,
    notes TEXT
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id BIGINT REFERENCES customer_profiles(profile_id) ON DELETE SET NULL,
    table_id BIGINT NOT NULL REFERENCES tables(table_id) ON DELETE CASCADE,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    party_size INT NOT NULL,
    special_requests TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no-show')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID, -- Can be used to track which staff member created this reservation
    confirmation_code VARCHAR(20) -- Unique code shared with customer
);

-- Large party requests (for parties > 10)
CREATE TABLE IF NOT EXISTS large_party_requests (
    request_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id BIGINT REFERENCES customer_profiles(profile_id) ON DELETE SET NULL,
    party_size INT NOT NULL,
    requested_date DATE NOT NULL,
    requested_time TIME NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    special_requests TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'booked', 'cancelled')),
    notes TEXT, -- For staff to add follow-up notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table availability exceptions (for temporary unavailability, like maintenance)
CREATE TABLE IF NOT EXISTS table_availability (
    exception_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_id BIGINT REFERENCES tables(table_id) ON DELETE CASCADE,
    unavailable_date DATE,
    start_time TIME,
    end_time TIME,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID -- Who marked this table as unavailable
);

-- Table service history (for analytics)
CREATE TABLE IF NOT EXISTS table_service_history (
    service_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_id BIGINT REFERENCES tables(table_id) ON DELETE CASCADE,
    reservation_id BIGINT REFERENCES reservations(reservation_id) ON DELETE SET NULL,
    service_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    party_size INT NOT NULL,
    revenue DECIMAL(10,2),
    rating INT, -- Customer satisfaction rating (1-5)
    notes TEXT
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(reservation_date, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_tables_capacity ON tables(capacity, is_active);
CREATE INDEX IF NOT EXISTS idx_customer_phone ON customer_profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE large_party_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_service_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tables
CREATE POLICY table_read_access ON tables FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY table_modify_access ON tables FOR ALL TO authenticated USING (
    auth.uid() IN (SELECT user_id FROM auth.users WHERE raw_user_meta_data->>'role' IN ('admin', 'staff'))
);

-- Create RLS policies for reservations
CREATE POLICY reservations_user_read_access ON reservations FOR SELECT TO authenticated USING (
    customer_id IN (SELECT profile_id FROM customer_profiles WHERE user_id = auth.uid())
);

CREATE POLICY reservations_staff_access ON reservations FOR ALL TO authenticated USING (
    auth.uid() IN (SELECT user_id FROM auth.users WHERE raw_user_meta_data->>'role' IN ('admin', 'staff'))
);

CREATE POLICY reservations_anon_create ON reservations FOR INSERT TO anon, authenticated WITH CHECK (true);

COMMIT;
