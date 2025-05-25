// API route for specific reservation by ID
import { reservationService } from '@/app/services/api';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const reservation = await reservationService.getReservationById(id);
    
    if (!reservation) {
      return new Response(JSON.stringify({ error: 'Reservation not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(reservation), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const updatedReservation = await reservationService.updateReservation(id, body);
    
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
