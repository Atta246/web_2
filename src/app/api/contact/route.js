// API route for contact form
import { withErrorHandling, successResponse, errorResponse, validateRequest, parseRequestBody } from '@/app/lib/api-utils';
import supabase from '@/app/lib/supabase-server';

export const POST = withErrorHandling(async (request) => {
  const body = await parseRequestBody(request);
  
  // Validate required fields
  const validation = validateRequest(body, ['name', 'email', 'message']);
  if (!validation.valid) {
    return errorResponse(validation.error, 400);
  }
  
  // Validate email format (simple check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    return errorResponse('Invalid email format', 400);
  }
  
  try {
    // Store the contact submission in Supabase database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: body.name,
          email: body.email,
          subject: body.subject || 'Contact Form Submission',
          message: body.message,
          status: 'new'
        }
      ])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to submit contact form. Please try again.', 500);
    }
    
    // TODO: Add email notification here if needed
      return successResponse({ 
      success: true,
      message: 'Contact form submitted successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return errorResponse('An unexpected error occurred', 500);
  }
});
