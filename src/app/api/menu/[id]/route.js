// API route for specific menu item by ID
import { withErrorHandling, successResponse, errorResponse, validateRequest, parseRequestBody } from '@/app/lib/api-utils';
import supabase from '@/app/lib/supabase-server';

export const GET = withErrorHandling(async (request, { params }) => {
  const { id } = params;
  
  try {
    // Fetch the specific menu item from Supabase
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories(name, description),
        menu_item_ingredients(
          quantity,
          ingredients(name, unit, allergen_information)
        )
      `)
      .eq('item_id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to fetch menu item', 500);
    }
    
    if (!data) {
      return errorResponse('Menu item not found', 404);
    }
    
    return successResponse(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    return errorResponse('An unexpected error occurred', 500);
  }
});

export const PUT = withErrorHandling(async (request, { params }) => {
  const { id } = params;
  const body = await parseRequestBody(request);
  
  // Validate required fields
  const validation = validateRequest(body, ['name', 'description', 'price']);
  if (!validation.valid) {
    return errorResponse(validation.error, 400);
  }
  
  try {
    // Check if menu item exists
    const { data: existingItem, error: checkError } = await supabase
      .from('menu_items')
      .select('item_id')
      .eq('item_id', id)
      .single();
    
    if (checkError || !existingItem) {
      return errorResponse('Menu item not found', 404);
    }
      // Update the menu item in Supabase
    const updateData = {
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      category_id: body.category_id,
      image_url: body.image_url || body.image,
      is_vegetarian: body.is_vegetarian,
      is_vegan: body.is_vegan,
      is_gluten_free: body.is_gluten_free,
      is_featured: body.is_featured,
      is_available: body.is_available,
      calories: body.calories,
      preparation_time: body.preparation_time,
      available: body.available
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );
    
    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('item_id', id)
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to update menu item', 500);
    }
    
    // Update ingredients if provided
    if (body.ingredients && Array.isArray(body.ingredients)) {
      // First delete existing relationships
      const { error: deleteError } = await supabase
        .from('menu_item_ingredients')
        .delete()
        .eq('item_id', id);
      
      if (deleteError) {
        console.error('Error deleting existing ingredients:', deleteError);
      }
      
      // Then add the new ones
      const ingredientMappings = body.ingredients.map(ing => ({
        item_id: id,
        ingredient_id: ing.ingredient_id,
        quantity: ing.quantity
      }));
      
      if (ingredientMappings.length > 0) {
        const { error: insertError } = await supabase
          .from('menu_item_ingredients')
          .insert(ingredientMappings);
          
        if (insertError) {
          console.error('Error updating ingredients:', insertError);
        }
      }
    }
    
    return successResponse(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    return errorResponse('An unexpected error occurred', 500);
  }
});

export const DELETE = withErrorHandling(async (request, { params }) => {
  const { id } = params;
  
  try {
    // Check if menu item exists
    const { data: existingItem, error: checkError } = await supabase
      .from('menu_items')
      .select('item_id')
      .eq('item_id', id)
      .single();
    
    if (checkError || !existingItem) {
      return errorResponse('Menu item not found', 404);
    }
    
    // First delete ingredient relations
    const { error: deleteIngredientsError } = await supabase
      .from('menu_item_ingredients')
      .delete()
      .eq('item_id', id);
      
    if (deleteIngredientsError) {
      console.error('Error deleting ingredient relations:', deleteIngredientsError);
      return errorResponse('Failed to delete menu item relationships', 500);
    }
    
    // Then delete the menu item
    const { error: deleteError } = await supabase
      .from('menu_items')
      .delete()
      .eq('item_id', id);
    
    if (deleteError) {
      console.error('Error deleting menu item:', deleteError);
      return errorResponse('Failed to delete menu item', 500);
    }
    
    return successResponse({ 
      message: 'Menu item deleted successfully',
      id: id
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return errorResponse('An unexpected error occurred', 500);
  }
});
