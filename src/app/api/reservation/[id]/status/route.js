// API route for updating reservation status
import { reservationService } from '@/app/services/api';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    if (!status) {
      return new Response(JSON.stringify({ error: 'Status is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const updatedReservation = await reservationService.updateReservationStatus(id, status);
    
    if (!updatedReservation) {
      return new Response(JSON.stringify({ error: 'Reservation not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(updatedReservation), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
