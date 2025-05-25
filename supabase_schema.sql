-- SQL to create tables in Supabase to match our restaurant management system schema

-- Customer profiles table
CREATE TABLE IF NOT EXISTS customer_profiles (
    profile_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    preferences TEXT,
    loyalty_points INT DEFAULT 0,
    is_guest BOOLEAN DEFAULT FALSE
);

-- Staff profiles table
CREATE TABLE IF NOT EXISTS staff_profiles (
    staff_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL
);

-- Menu categories table
CREATE TABLE IF NOT EXISTS menu_categories (
    category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES menu_categories(category_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    calories INT,
    preparation_time INT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    stock_quantity INT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    allergen_information TEXT
);

-- Many-to-many relationship between menu items and ingredients
CREATE TABLE IF NOT EXISTS menu_item_ingredients (
    item_id BIGINT NOT NULL REFERENCES menu_items(item_id) ON DELETE CASCADE,
    ingredient_id BIGINT NOT NULL REFERENCES ingredients(ingredient_id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (item_id, ingredient_id)
);

-- Tables in the restaurant
CREATE TABLE IF NOT EXISTS tables (
    table_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_number VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
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
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    submission_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved')),
    assigned_to BIGINT REFERENCES staff_profiles(staff_id) ON DELETE SET NULL,
    notes TEXT
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for customer profiles: users can read/update their own profile
CREATE POLICY customer_profiles_user_access 
ON customer_profiles 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy for customer profiles: staff and admin can read/update any profile
CREATE POLICY customer_profiles_staff_access 
ON customer_profiles 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM staff_profiles sp 
    JOIN auth.users u ON sp.user_id = u.id 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' IN ('admin', 'staff')
));

-- Policy for staff profiles: staff can read/update their own profile
CREATE POLICY staff_profiles_user_access 
ON staff_profiles 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy for staff profiles: admin can read/update any staff profile
CREATE POLICY staff_profiles_admin_access 
ON staff_profiles 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' = 'admin'
));

-- Policy for menu items: anyone can read
CREATE POLICY menu_items_read_access 
ON menu_items 
FOR SELECT 
TO authenticated, anon
USING (true);

-- Policy for menu items: only staff/admin can modify
CREATE POLICY menu_items_modify_access 
ON menu_items 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM staff_profiles sp 
    JOIN auth.users u ON sp.user_id = u.id 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' IN ('admin', 'staff')
))
WITH CHECK (EXISTS (
    SELECT 1 FROM staff_profiles sp 
    JOIN auth.users u ON sp.user_id = u.id 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' IN ('admin', 'staff')
));

-- Policy for reservations: users can see their own reservations
CREATE POLICY reservations_user_access 
ON reservations 
FOR SELECT 
USING (
    customer_id IN (
        SELECT profile_id FROM customer_profiles 
        WHERE user_id = auth.uid()
    )
);

-- Policy for reservations: staff/admin can see all reservations
CREATE POLICY reservations_staff_access 
ON reservations 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM staff_profiles sp 
    JOIN auth.users u ON sp.user_id = u.id 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' IN ('admin', 'staff')
));

-- Policy for contact submissions: anyone can create
CREATE POLICY contact_submissions_create_access 
ON contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Policy for contact submissions: only staff/admin can read/update
CREATE POLICY contact_submissions_staff_access 
ON contact_submissions 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM staff_profiles sp 
    JOIN auth.users u ON sp.user_id = u.id 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' IN ('admin', 'staff')
));
