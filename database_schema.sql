-- Restaurant Management System Database Schema

-- Users table - store user authentication information
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'customer') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customer profiles table - extends user information for customers
CREATE TABLE customer_profiles (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    preferences TEXT,
    loyalty_points INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Staff profiles table - extends user information for staff members
CREATE TABLE staff_profiles (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Menu categories table
CREATE TABLE menu_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0
);

-- Menu items table
CREATE TABLE menu_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    calories INT,
    preparation_time INT, -- in minutes
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(category_id) ON DELETE CASCADE
);

-- Menu item ingredients
CREATE TABLE ingredients (
    ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    stock_quantity INT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    allergen_information TEXT
);

-- Many-to-many relationship between menu items and ingredients
CREATE TABLE menu_item_ingredients (
    item_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (item_id, ingredient_id),
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE
);

-- Tables in the restaurant
CREATE TABLE tables (
    table_id INT PRIMARY KEY AUTO_INCREMENT,
    table_number VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(50), -- e.g., 'window', 'patio', 'private room'
    is_active BOOLEAN DEFAULT TRUE
);

-- Reservations table
CREATE TABLE reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT, -- can be NULL for walk-ins
    table_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    party_size INT NOT NULL,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer_profiles(profile_id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES tables(table_id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT,
    customer_id INT,
    table_id INT,
    staff_id INT NOT NULL, -- server who took the order
    order_type ENUM('dine-in', 'takeout', 'delivery') NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'served', 'completed', 'cancelled') NOT NULL,
    order_date DATE NOT NULL,
    order_time TIME NOT NULL,
    special_instructions TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    tip DECIMAL(10, 2),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'refunded') NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customer_profiles(profile_id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES tables(table_id) ON DELETE SET NULL,
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(staff_id)
);

-- Order details (items in an order)
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,
    status ENUM('ordered', 'preparing', 'ready', 'served', 'cancelled') NOT NULL DEFAULT 'ordered',
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE
);

-- Order item modifications (e.g., "no onions", "extra cheese")
CREATE TABLE order_item_modifications (
    modification_id INT PRIMARY KEY AUTO_INCREMENT,
    order_item_id INT NOT NULL,
    modification_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    additional_cost DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE
);

-- Delivery information
CREATE TABLE deliveries (
    delivery_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT UNIQUE NOT NULL,
    address TEXT NOT NULL,
    delivery_instructions TEXT,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    driver_id INT,
    delivery_status ENUM('pending', 'assigned', 'in-transit', 'delivered', 'cancelled') NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES staff_profiles(staff_id) ON DELETE SET NULL
);

-- Payments table
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    transaction_id VARCHAR(100),
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Customer feedback/reviews
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    order_id INT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE,
    response TEXT,
    response_date TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer_profiles(profile_id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL
);

-- Contact form submissions
CREATE TABLE contact_submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'in-progress', 'resolved') DEFAULT 'new',
    assigned_to INT,
    notes TEXT,
    FOREIGN KEY (assigned_to) REFERENCES staff_profiles(staff_id) ON DELETE SET NULL
);

-- Promotions and special offers
CREATE TABLE promotions (
    promotion_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    discount_type ENUM('percentage', 'fixed', 'bogo', 'free_item') NOT NULL,
    discount_value DECIMAL(10, 2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    promo_code VARCHAR(50) UNIQUE,
    usage_limit INT,
    current_usage INT DEFAULT 0,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    applies_to ENUM('all', 'category', 'item') NOT NULL DEFAULT 'all',
    category_id INT,
    item_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE SET NULL
);

-- Inventory tracking
CREATE TABLE inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    reorder_level INT NOT NULL,
    cost_per_unit DECIMAL(10, 2) NOT NULL,
    supplier_id INT,
    last_ordered_date DATE,
    expiration_date DATE
);

-- Suppliers
CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    website VARCHAR(100),
    notes TEXT
);

-- Event bookings (for private events)
CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    event_name VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    guest_count INT NOT NULL,
    room_id INT,
    status ENUM('inquiry', 'tentative', 'confirmed', 'cancelled', 'completed') NOT NULL,
    deposit_amount DECIMAL(10, 2),
    deposit_paid BOOLEAN DEFAULT FALSE,
    total_amount DECIMAL(10, 2),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer_profiles(profile_id) ON DELETE SET NULL
);

-- Shift schedules for staff
CREATE TABLE shifts (
    shift_id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    position VARCHAR(50) NOT NULL,
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show') NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(staff_id) ON DELETE CASCADE
);

-- Audit logs for tracking important system changes
CREATE TABLE audit_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Create indexes for performance optimization
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_shifts_staff_date ON shifts(staff_id, shift_date);

-- Example views for common queries

-- View for upcoming reservations
CREATE VIEW upcoming_reservations AS
SELECT 
    r.reservation_id,
    CONCAT(cp.first_name, ' ', cp.last_name) AS customer_name,
    cp.phone,
    r.reservation_date,
    r.start_time,
    r.party_size,
    t.table_number,
    r.status,
    r.special_requests
FROM 
    reservations r
    JOIN customer_profiles cp ON r.customer_id = cp.profile_id
    JOIN tables t ON r.table_id = t.table_id
WHERE 
    r.status = 'confirmed'
    AND (r.reservation_date > CURDATE() 
        OR (r.reservation_date = CURDATE() AND r.start_time > CURTIME()));

-- View for daily sales
CREATE VIEW daily_sales AS
SELECT 
    o.order_date,
    COUNT(o.order_id) AS total_orders,
    SUM(o.subtotal) AS total_sales_before_tax,
    SUM(o.tax) AS total_tax,
    SUM(o.total_amount) AS total_revenue,
    AVG(o.total_amount) AS average_order_value,
    SUM(CASE WHEN o.order_type = 'dine-in' THEN o.total_amount ELSE 0 END) AS dine_in_revenue,
    SUM(CASE WHEN o.order_type = 'takeout' THEN o.total_amount ELSE 0 END) AS takeout_revenue,
    SUM(CASE WHEN o.order_type = 'delivery' THEN o.total_amount ELSE 0 END) AS delivery_revenue
FROM 
    orders o
WHERE 
    o.status = 'completed'
GROUP BY 
    o.order_date
ORDER BY 
    o.order_date DESC;

-- View for popular menu items
CREATE VIEW popular_menu_items AS
SELECT 
    mi.item_id,
    mi.name,
    mc.name AS category,
    mi.price,
    COUNT(oi.order_item_id) AS times_ordered,
    SUM(oi.quantity) AS total_quantity_ordered,
    AVG(r.rating) AS average_rating,
    COUNT(r.rating) AS number_of_ratings
FROM 
    menu_items mi
    JOIN menu_categories mc ON mi.category_id = mc.category_id
    LEFT JOIN order_items oi ON mi.item_id = oi.menu_item_id
    LEFT JOIN orders o ON oi.order_id = o.order_id
    LEFT JOIN reviews r ON o.order_id = r.order_id
GROUP BY 
    mi.item_id, mi.name, mc.name, mi.price
ORDER BY 
    total_quantity_ordered DESC;
