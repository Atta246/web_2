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
-- Create some initial table data
INSERT INTO tables (table_number, capacity, location, is_active)
VALUES 
  ('T1', 2, 'Window', true),
  ('T2', 2, 'Window', true),
  ('T3', 4, 'Center', true),
  ('T4', 4, 'Center', true),
  ('T5', 6, 'Corner', true),
  ('T6', 6, 'Patio', true),
  ('T7', 8, 'Private Room', true),
  ('T8', 10, 'Private Room', true);


-- Create menu categories
INSERT INTO menu_categories (name, description, display_order)
VALUES
  ('Starters', 'Begin your meal with our delightful appetizers', 1),
  ('Mains', 'Our chef''s special main courses', 2),
  ('Pizza', 'Handcrafted pizzas with premium toppings', 3),
  ('Pasta', 'Fresh pasta dishes made in-house daily', 4),
  ('Desserts', 'Sweet treats to complete your meal', 5),
  ('Drinks', 'Refreshing beverages and fine wines', 6);

-- Create menu items
INSERT INTO menu_items (category_id, name, description, price, image_url, is_vegetarian, is_vegan, is_gluten_free, is_featured)
VALUES
  ((SELECT category_id FROM menu_categories WHERE name = 'Starters'), 'Caesar Salad', 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing', 12.99, 'https://images.unsplash.com/photo-1551248429-40975aa4de74', false, false, false, true),
  ((SELECT category_id FROM menu_categories WHERE name = 'Starters'), 'Bruschetta', 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil', 9.99, 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f', true, true, false, false),
  ((SELECT category_id FROM menu_categories WHERE name = 'Mains'), 'Grilled Salmon', 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables', 24.99, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', false, false, true, true),
  ((SELECT category_id FROM menu_categories WHERE name = 'Mains'), 'Beef Tenderloin', 'Prime beef tenderloin with red wine reduction and truffle mashed potatoes', 32.99, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', false, false, false, true),
  ((SELECT category_id FROM menu_categories WHERE name = 'Pizza'), 'Margherita Pizza', 'Classic pizza with tomato sauce, fresh mozzarella, and basil', 18.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', true, false, false, false),
  ((SELECT category_id FROM menu_categories WHERE name = 'Pasta'), 'Shrimp Pasta', 'Linguine with jumbo shrimp, cherry tomatoes, garlic, and white wine sauce', 22.99, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8', false, false, false, true),
  ((SELECT category_id FROM menu_categories WHERE name = 'Desserts'), 'Tiramisu', 'Classic Italian dessert with layers of coffee-soaked ladyfingers and marscarpone cream', 8.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9', true, false, false, false),
  ((SELECT category_id FROM menu_categories WHERE name = 'Desserts'), 'Chocolate Mousse', 'Rich and creamy chocolate mousse topped with whipped cream', 7.99, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', true, false, false, false);

-- Create ingredients
INSERT INTO ingredients (name, stock_quantity, unit, allergen_information)
VALUES
  ('Romaine Lettuce', 100, 'kg', NULL),
  ('Parmesan Cheese', 50, 'kg', 'Dairy'),
  ('Salmon Fillet', 80, 'kg', 'Fish'),
  ('Beef Tenderloin', 60, 'kg', NULL),
  ('Shrimp', 70, 'kg', 'Shellfish'),
  ('Pasta', 120, 'kg', 'Gluten'),
  ('Tomatoes', 90, 'kg', NULL),
  ('Garlic', 30, 'kg', NULL),
  ('Olive Oil', 50, 'liter', NULL),
  ('Mozzarella', 75, 'kg', 'Dairy');

-- Create menu item ingredients relationships
INSERT INTO menu_item_ingredients (item_id, ingredient_id, quantity)
VALUES
  (1, 1, 0.2), -- Caesar Salad - Romaine Lettuce
  (1, 2, 0.05), -- Caesar Salad - Parmesan
  (2, 7, 0.15), -- Bruschetta - Tomatoes
  (2, 8, 0.01), -- Bruschetta - Garlic
  (2, 9, 0.02), -- Bruschetta - Olive Oil
  (3, 3, 0.25), -- Grilled Salmon - Salmon
  (4, 4, 0.3), -- Beef Tenderloin
  (5, 7, 0.2), -- Margherita - Tomatoes
  (5, 10, 0.15), -- Margherita - Mozzarella
  (6, 5, 0.18), -- Shrimp Pasta - Shrimp
  (6, 6, 0.2); -- Shrimp Pasta - Pasta
