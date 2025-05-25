// API route for menu items
import { withErrorHandling, successResponse, errorResponse, validateRequest, parseRequestBody } from '@/app/lib/api-utils';
import supabase from '@/app/lib/supabase-server';

export const GET = withErrorHandling(async () => {
  try {
    // Fetch menu items from Supabase
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories(name, description)
      `)
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to fetch menu items', 500);
    }
    
    return successResponse(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    return errorResponse('An unexpected error occurred', 500);
  }
});

export const POST = withErrorHandling(async (request) => {
  const body = await parseRequestBody(request);
  
  // Validate required fields
  const validation = validateRequest(body, ['name', 'description', 'price', 'category_id']);
  if (!validation.valid) {
    return errorResponse(validation.error, 400);
  }
  try {
    // Insert the menu item into Supabase
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        category_id: body.category_id,
        image_url: body.image_url || body.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        is_vegetarian: body.is_vegetarian || false,
        is_vegan: body.is_vegan || false,
        is_gluten_free: body.is_gluten_free || false,
        is_featured: body.is_featured || false,
        is_available: body.is_available !== false,
        calories: body.calories,
        preparation_time: body.preparation_time,
        available: body.available !== undefined ? body.available : true
      }])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to create menu item', 500);
    }
    
    return successResponse(data[0], 201);
  } catch (err) {
    console.error('Unexpected error:', err);
    return errorResponse('An unexpected error occurred', 500);
  }
});
