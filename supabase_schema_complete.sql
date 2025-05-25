-- SQL to create tables in Supabase to match our restaurant management system schema

BEGIN;

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
CREATE POLICY IF NOT EXISTS customer_profiles_user_access 
ON customer_profiles 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy for customer profiles: staff and admin can read/update any profile
CREATE POLICY IF NOT EXISTS customer_profiles_staff_access 
ON customer_profiles 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM staff_profiles sp 
    JOIN auth.users u ON sp.user_id = u.id 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' IN ('admin', 'staff')
));

-- Policy for staff profiles: staff can read/update their own profile
CREATE POLICY IF NOT EXISTS staff_profiles_user_access 
ON staff_profiles 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy for staff profiles: admin can read/update any staff profile
CREATE POLICY IF NOT EXISTS staff_profiles_admin_access 
ON staff_profiles 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' = 'admin'
));

-- Policy for menu items: anyone can read
CREATE POLICY IF NOT EXISTS menu_items_read_access 
ON menu_items 
FOR SELECT 
TO authenticated, anon
USING (true);

-- Policy for menu items: only staff/admin can modify
CREATE POLICY IF NOT EXISTS menu_items_modify_access 
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
CREATE POLICY IF NOT EXISTS reservations_user_access 
ON reservations 
FOR SELECT 
USING (
    customer_id IN (
        SELECT profile_id FROM customer_profiles 
        WHERE user_id = auth.uid()
    )
);

-- Policy for reservations: staff/admin can see all reservations
CREATE POLICY IF NOT EXISTS reservations_staff_access 
ON reservations 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM staff_profiles sp 
    JOIN auth.users u ON sp.user_id = u.id 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' IN ('admin', 'staff')
));

-- Policy for contact submissions: anyone can create
CREATE POLICY IF NOT EXISTS contact_submissions_create_access 
ON contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Policy for contact submissions: only staff/admin can read/update
CREATE POLICY IF NOT EXISTS contact_submissions_staff_access 
ON contact_submissions 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM staff_profiles sp 
    JOIN auth.users u ON sp.user_id = u.id 
    WHERE u.id = auth.uid() AND u.raw_user_meta_data->>'role' IN ('admin', 'staff')
));

-- Add policy for anonymous reservations
CREATE POLICY IF NOT EXISTS anon_reservation_create
ON reservations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow reading tables data by anyone
CREATE POLICY IF NOT EXISTS tables_read_access
ON tables
FOR SELECT
TO anon, authenticated
USING (true);

-- Sample Data Section

-- Sample data for tables
INSERT INTO tables (table_number, capacity, location, is_active)
VALUES 
  ('1', 2, 'Window', true),
  ('2', 2, 'Window', true),
  ('3', 4, 'Main', true),
  ('4', 4, 'Main', true),
  ('5', 6, 'Main', true),
  ('6', 8, 'Private', true),
  ('7', 10, 'Private', true)
ON CONFLICT DO NOTHING;

-- Sample data for menu categories
INSERT INTO menu_categories (name, description, display_order)
VALUES
  ('Starters', 'Begin your meal with our delectable appetizers', 1),
  ('Soups & Salads', 'Fresh and flavorful options to start your meal', 2),
  ('Mains', 'Our chef''s signature main course selections', 3),
  ('Pasta', 'Handmade pasta dishes with premium ingredients', 4),
  ('Pizza', 'Wood-fired pizzas with artisanal toppings', 5),
  ('Seafood', 'Fresh seafood prepared daily', 6),
  ('Vegetarian', 'Delicious plant-based options', 7),
  ('Desserts', 'Sweet treats to end your meal', 8),
  ('Beverages', 'Refreshing drinks to complement your food', 9)
ON CONFLICT DO NOTHING;

-- Sample data for ingredients
INSERT INTO ingredients (name, stock_quantity, unit, allergen_information)
VALUES
  ('Tomatoes', 50, 'kg', NULL),
  ('Mozzarella Cheese', 30, 'kg', 'Contains dairy'),
  ('Flour', 100, 'kg', 'Contains gluten'),
  ('Olive Oil', 40, 'liter', NULL),
  ('Garlic', 10, 'kg', NULL),
  ('Basil', 5, 'kg', NULL),
  ('Salmon', 30, 'kg', 'Contains fish'),
  ('Chicken Breast', 40, 'kg', NULL),
  ('Beef Tenderloin', 25, 'kg', NULL),
  ('Mixed Greens', 20, 'kg', NULL),
  ('Parmesan Cheese', 15, 'kg', 'Contains dairy'),
  ('Eggs', 200, 'units', 'Contains egg'),
  ('Butter', 20, 'kg', 'Contains dairy'),
  ('Heavy Cream', 15, 'liter', 'Contains dairy'),
  ('Rice', 50, 'kg', NULL),
  ('Shrimp', 25, 'kg', 'Contains shellfish'),
  ('Chocolate', 10, 'kg', 'May contain dairy'),
  ('Vanilla Extract', 2, 'liter', NULL)
ON CONFLICT DO NOTHING;

-- Sample data for menu items
INSERT INTO menu_items (category_id, name, description, price, image_url, is_vegetarian, is_vegan, is_gluten_free, is_featured, calories, preparation_time, available)
VALUES
  -- Starters
  ((SELECT category_id FROM menu_categories WHERE name = 'Starters'), 'Bruschetta', 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil', 9.99, 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f', TRUE, TRUE, FALSE, TRUE, 320, 15, TRUE),
  ((SELECT category_id FROM menu_categories WHERE name = 'Starters'), 'Calamari Fritti', 'Crispy fried calamari served with lemon aioli', 12.99, 'https://images.unsplash.com/photo-1596459467941-8d1d5950f039', FALSE, FALSE, FALSE, FALSE, 450, 20, TRUE),
  
  -- Soups & Salads
  ((SELECT category_id FROM menu_categories WHERE name = 'Soups & Salads'), 'Caesar Salad', 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing', 12.99, 'https://images.unsplash.com/photo-1551248429-40975aa4de74', FALSE, FALSE, FALSE, FALSE, 380, 10, TRUE),
  ((SELECT category_id FROM menu_categories WHERE name = 'Soups & Salads'), 'Minestrone Soup', 'Traditional Italian vegetable soup with beans and pasta', 8.99, 'https://images.unsplash.com/photo-1547592166-23ac45744acd', TRUE, FALSE, FALSE, FALSE, 220, 15, TRUE),
  
  -- Mains
  ((SELECT category_id FROM menu_categories WHERE name = 'Mains'), 'Grilled Salmon', 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables', 24.99, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', FALSE, FALSE, TRUE, TRUE, 520, 25, TRUE),
  ((SELECT category_id FROM menu_categories WHERE name = 'Mains'), 'Beef Tenderloin', 'Prime beef tenderloin with red wine reduction and truffle mashed potatoes', 32.99, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', FALSE, FALSE, TRUE, FALSE, 650, 30, TRUE),
  ((SELECT category_id FROM menu_categories WHERE name = 'Mains'), 'Chicken Piccata', 'Pan-seared chicken breast with lemon-caper sauce and angel hair pasta', 22.99, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d', FALSE, FALSE, FALSE, FALSE, 580, 25, TRUE),
  
  -- Pasta
  ((SELECT category_id FROM menu_categories WHERE name = 'Pasta'), 'Spaghetti Carbonara', 'Classic pasta with pancetta, egg, black pepper, and parmesan cheese', 18.99, 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b', FALSE, FALSE, FALSE, FALSE, 720, 20, TRUE),
  ((SELECT category_id FROM menu_categories WHERE name = 'Pasta'), 'Shrimp Pasta', 'Linguine with jumbo shrimp, cherry tomatoes, garlic, and white wine sauce', 22.99, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8', FALSE, FALSE, FALSE, TRUE, 680, 25, TRUE),
  
  -- Pizza
  ((SELECT category_id FROM menu_categories WHERE name = 'Pizza'), 'Margherita Pizza', 'Classic pizza with tomato sauce, fresh mozzarella, and basil', 18.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', TRUE, FALSE, FALSE, TRUE, 780, 15, TRUE),
  ((SELECT category_id FROM menu_categories WHERE name = 'Pizza'), 'Prosciutto Funghi', 'Pizza with prosciutto ham, mushrooms, mozzarella, and truffle oil', 21.99, 'https://images.unsplash.com/photo-1589840700256-41c5d84af80d', FALSE, FALSE, FALSE, FALSE, 820, 15, TRUE),
  
  -- Vegetarian
  ((SELECT category_id FROM menu_categories WHERE name = 'Vegetarian'), 'Vegetable Curry', 'Assorted vegetables in a rich curry sauce, served with basmati rice', 16.99, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', TRUE, TRUE, TRUE, FALSE, 450, 20, TRUE),
  ((SELECT category_id FROM menu_categories WHERE name = 'Vegetarian'), 'Eggplant Parmesan', 'Layers of eggplant, tomato sauce, mozzarella and parmesan cheese', 17.99, 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab', TRUE, FALSE, FALSE, FALSE, 520, 25, TRUE),
  
  -- Desserts
  ((SELECT category_id FROM menu_categories WHERE name = 'Desserts'), 'Tiramisu', 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream', 8.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9', TRUE, FALSE, FALSE, TRUE, 420, 10, TRUE),
  ((SELECT category_id FROM menu_categories WHERE name = 'Desserts'), 'Chocolate Mousse', 'Rich and creamy chocolate mousse topped with whipped cream', 7.99, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', TRUE, FALSE, TRUE, FALSE, 380, 15, TRUE)
ON CONFLICT DO NOTHING;

-- Create some menu_item_ingredients relationships
INSERT INTO menu_item_ingredients (item_id, ingredient_id, quantity)
SELECT m.item_id, i.ingredient_id, 0.25
FROM menu_items m, ingredients i
WHERE m.name = 'Bruschetta' AND i.name = 'Tomatoes'
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_ingredients (item_id, ingredient_id, quantity)
SELECT m.item_id, i.ingredient_id, 0.1
FROM menu_items m, ingredients i
WHERE m.name = 'Bruschetta' AND i.name = 'Garlic'
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_ingredients (item_id, ingredient_id, quantity)
SELECT m.item_id, i.ingredient_id, 0.05
FROM menu_items m, ingredients i
WHERE m.name = 'Bruschetta' AND i.name = 'Basil'
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_ingredients (item_id, ingredient_id, quantity)
SELECT m.item_id, i.ingredient_id, 0.5
FROM menu_items m, ingredients i
WHERE m.name = 'Grilled Salmon' AND i.name = 'Salmon'
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_ingredients (item_id, ingredient_id, quantity)
SELECT m.item_id, i.ingredient_id, 0.2
FROM menu_items m, ingredients i
WHERE m.name = 'Grilled Salmon' AND i.name = 'Butter'
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_ingredients (item_id, ingredient_id, quantity)
SELECT m.item_id, i.ingredient_id, 0.5
FROM menu_items m, ingredients i
WHERE m.name = 'Caesar Salad' AND i.name = 'Mixed Greens'
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_ingredients (item_id, ingredient_id, quantity)
SELECT m.item_id, i.ingredient_id, 0.1
FROM menu_items m, ingredients i
WHERE m.name = 'Caesar Salad' AND i.name = 'Parmesan Cheese'
ON CONFLICT DO NOTHING;

INSERT INTO menu_item_ingredients (item_id, ingredient_id, quantity)
SELECT m.item_id, i.ingredient_id, 2
FROM menu_items m, ingredients i
WHERE m.name = 'Caesar Salad' AND i.name = 'Eggs'
ON CONFLICT DO NOTHING;

COMMIT;
