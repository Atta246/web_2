# Menu Management Documentation

## Overview

The menu management system allows restaurant administrators to create, update, delete, and view menu items. The system is built with React and Next.js for the frontend and uses Supabase as the backend database.

## Features

- **View Menu Items**: Display all menu items with details including name, description, price, and category
- **Search and Filter**: Search menu items by name or description and filter by category
- **Create Menu Items**: Add new items with comprehensive details
- **Update Menu Items**: Edit existing menu items
- **Delete Menu Items**: Remove menu items from the database
- **Status Indicators**: Visual indicators for featured items and item availability

## Database Schema

The menu management system uses a `menu_items` table in Supabase with the following columns:

- `item_id`: Unique identifier (Primary Key)
- `name`: Item name (Text, Required)
- `description`: Item description (Text)
- `price`: Item price (Decimal)
- `category`: Item category (Text)
- `category_id`: Category foreign key (Integer)
- `is_available`: Whether the item is currently available (Boolean)
- `is_featured`: Whether the item is featured on the homepage (Boolean)
- `image_url`: URL to the item's image (Text)
- `preparation_time`: Time in minutes to prepare the item (Integer)
- `created_at`: Timestamp when the item was created (Timestamp with timezone)

## Setup Instructions

1. Ensure your database has the proper schema by running the setup script:
   ```powershell
   ./setup/check-menu.ps1
   ```

2. Navigate to the admin menu page at `/admin/menu` after logging in as an admin

## Using the Menu Management System

### Adding Menu Items
1. Click the "Add Menu Item" button
2. Fill in the required fields (name, description, price, category)
3. Optionally add an image URL, preparation time, and set availability and featured status
4. Click "Add Item" to save the new menu item

### Editing Menu Items
1. Click the "Edit" button next to an existing menu item
2. Modify any fields as needed
3. Click "Update Item" to save changes

### Deleting Menu Items
1. Click the "Delete" button next to an item
2. Confirm deletion in the confirmation dialog

### Filtering and Searching
- Click on category buttons to filter by specific categories
- Use the search bar to find items by name or description

## Troubleshooting

If you encounter issues with the menu management system:

1. Check that your Supabase database is properly configured
2. Run the database check script: `./setup/check-menu.ps1`
3. Check the browser console for any JavaScript errors
4. Verify that the admin user has proper permissions to access the menu management API endpoints
