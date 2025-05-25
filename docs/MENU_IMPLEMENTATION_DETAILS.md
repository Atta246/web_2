# Menu Management Implementation Details

## Database Schema

The menu system uses a `menu_items` table with the following key structure:

```sql
CREATE TABLE IF NOT EXISTS public.menu_items (
  item_id SERIAL PRIMARY KEY, -- Auto-incremented primary key
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  category_id INTEGER, -- Foreign key to the menu_categories table
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  preparation_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

## Key Components

### 1. Database Interaction (api.js)

The menu service in `api.js` handles CRUD operations for menu items:

- **Create**: No longer attempts to set `item_id` manually, respecting Supabase's IDENTITY column
- **Read**: Transforms database records to match the UI's expected format
- **Update**: Properly handles the item_id for identifying records
- **Delete**: Uses the correct item_id reference for deletion

### 2. Data Formatting (menu-utils.js)

Utility functions handle data transformation between the UI and database:

- `formatMenuItem`: Standardizes menu item objects for display
- `formatMenuItemForDb`: Prepares data for database operations, properly excluding fields that should be managed by the database

### 3. UI Component (admin/menu/page.js)

The React component provides an intuitive interface for:
- Viewing menu items with status indicators for availability and featured items
- Adding new menu items with proper validation
- Editing existing items
- Filtering and searching items

## Implementation Details

### Item ID Handling

- The database uses a `SERIAL PRIMARY KEY` for `item_id`
- When creating new items, the application does not try to set `item_id` manually
- The API includes necessary fields like `category_id` to satisfy foreign key constraints
- The API returns the database-generated `item_id` after item creation

### Category Handling

- Each menu item is associated with both a category name (text) and category_id (foreign key)
- A default category_id (1) is used when one isn't specified

### Image Handling

- Supports both `image` and `image_url` field names for compatibility
- Prioritizes existing values when updating items

## Troubleshooting

If menu items aren't displaying or saving correctly:

1. Check that the `menu_items` table exists with the correct schema
2. Ensure that the `category_id` field references a valid category
3. Verify that no code is trying to manually set the `item_id` field
4. Use the browser console to check for API errors during CRUD operations

Run the database check script to verify the database schema:

```powershell
cd setup; ./check-menu.ps1
```
