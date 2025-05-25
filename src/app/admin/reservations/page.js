'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, AuthProvider } from '../../context/AuthContext';
import { reservationService } from '../../services/api';

// Empty initial state - will be populated from the API
const initialReservations = [];

function Reservations() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState(initialReservations);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reservations from API
  const fetchReservations = async () => {
    try {
      setLoadingReservations(true);
      setError(null);
      const data = await reservationService.getAllReservations();
      setReservations(data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations. Please try again later.');
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/admin');
    }
    
    // Fetch data from the API if user is authenticated
    if (user) {
      fetchReservations();
    }
  }, [user, loading, router]);
  // Filter reservations based on status and date
  const filteredReservations = reservations.filter(res => {
    const matchesStatus = filter === 'all' || res.status === filter;
    const matchesDate = !dateFilter || res.date === dateFilter;
    return matchesStatus && matchesDate;
  });
  // Update reservation status using the API
  const handleStatusChange = async (id, newStatus) => {
    try {
      await reservationService.updateReservationStatus(id, newStatus);
      // Update local state after successful API call
      setReservations(prev => 
        prev.map(res => (res.reservation_id === id || res.id === id) ? { ...res, status: newStatus } : res)
      );
    } catch (err) {
      console.error(`Error updating reservation status to ${newStatus}:`, err);
      alert(`Failed to update reservation status: ${err.message || 'Please try again'}`);
    }
  };

  const handleViewDetails = (reservation) => {
    setCurrentReservation(reservation);
    setIsModalOpen(true);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reservation Management</h1>
        <div className="flex space-x-4">
          <div>
            <label htmlFor="date-filter" className="sr-only">Filter by date</label>
            <input
              type="date"
              id="date-filter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
          <div>
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="all">All Reservations</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>      {/* Reservations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        {loadingReservations ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading reservations...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{error}</p>
            <button 
              onClick={fetchReservations} 
              className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">No reservations found. Try a different filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReservations.map(reservation => (
                  <tr key={reservation.reservation_id || reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{reservation.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.email}</div>
                          {reservation.phone && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{reservation.date}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{reservation.guests}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button 
                        onClick={() => handleViewDetails(reservation)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                      >
                        View Details
                      </button>
                      {reservation.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(reservation.reservation_id || reservation.id, 'confirmed')}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleStatusChange(reservation.reservation_id || reservation.id, 'cancelled')}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <button 
                          onClick={() => handleStatusChange(reservation.reservation_id || reservation.id, 'cancelled')}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredReservations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No reservations found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {isModalOpen && currentReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Reservation Details
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Guest Name</h4>
                <p className="text-base text-gray-900 dark:text-white">{currentReservation.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                  <p className="text-base text-gray-900 dark:text-white">{currentReservation.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                  <p className="text-base text-gray-900 dark:text-white">{currentReservation.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</h4>
                  <p className="text-base text-gray-900 dark:text-white">{currentReservation.date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</h4>
                  <p className="text-base text-gray-900 dark:text-white">{currentReservation.time}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Guests</h4>
                <p className="text-base text-gray-900 dark:text-white">{currentReservation.guests}</p>
              </div>
              {currentReservation.message && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Special Requests</h4>
                  <p className="text-base text-gray-900 dark:text-white">{currentReservation.message}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(currentReservation.status)}`}>
                  {currentReservation.status.charAt(0).toUpperCase() + currentReservation.status.slice(1)}
                </span>
              </div>
            </div>            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              {currentReservation.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusChange(currentReservation.reservation_id || currentReservation.id, 'confirmed');
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(currentReservation.reservation_id || currentReservation.id, 'cancelled');
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </>
              )}
              {currentReservation.status === 'confirmed' && (
                <button
                  onClick={() => {
                    handleStatusChange(currentReservation.reservation_id || currentReservation.id, 'cancelled');
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>      )}
    </div>
  );
}

// Export with AuthProvider wrapper
export default function ReservationsPage() {
  return (
    <AuthProvider>
      <Reservations />
    </AuthProvider>
  );
}
