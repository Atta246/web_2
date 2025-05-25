'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, AuthProvider } from '../../context/AuthContext';
import { reservationService, menuService } from '../../services/api';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Reports() {
  return (
    <AuthProvider>
      <ReportsContent />
    </AuthProvider>
  );
}

function ReportsContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reportType, setReportType] = useState('reservations');
  const [dateRange, setDateRange] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // Detect dark mode for chart colors
  useEffect(() => {
    // Check initial dark mode
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // Handle window resize for responsive charts
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Calculate date ranges
  useEffect(() => {
    const today = new Date();
    let start = new Date();
    const end = new Date();

    switch (dateRange) {
      case 'today':
        // Just today
        start = new Date(today.setHours(0, 0, 0, 0));
        break;
      case 'week':
        // Last 7 days
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        // Last 30 days
        start = new Date(today);
        start.setDate(today.getDate() - 30);
        break;
      case 'year':
        // Last 365 days
        start = new Date(today);
        start.setFullYear(today.getFullYear() - 1);
        break;
      case 'custom':
        // Use the custom dates
        if (startDate) {
          start = new Date(startDate);
        }
        if (endDate) {
          end.setTime(new Date(endDate).getTime());
        }
        break;
    }
    
    // Format dates for API
    const formatDateForAPI = (date) => {
      return date.toISOString().split('T')[0];
    };

    // If we have valid dates, fetch data
    if (start && end && dateRange) {
      fetchReportData(formatDateForAPI(start), formatDateForAPI(end));
    }
  }, [dateRange, startDate, endDate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const fetchReportData = async (startDate, endDate) => {
    setLoading(true);
    try {
      if (reportType === 'reservations') {
        const data = await reservationService.getReservationsReport(startDate, endDate);
        setReservations(data || []);
      } else if (reportType === 'menu') {
        const data = await menuService.getMenuPopularityReport(startDate, endDate);
        setMenuItems(data || []);
      }
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${reportType} report:`, err);
      setError(`Failed to load ${reportType} report. Please try again later.`);
      
      // Set sample data for demonstration
      if (reportType === 'reservations') {
        setReservations([
          { date: '2025-05-21', totalReservations: 12, totalGuests: 36, averagePartySize: 3 },
          { date: '2025-05-20', totalReservations: 8, totalGuests: 24, averagePartySize: 3 },
          { date: '2025-05-19', totalReservations: 10, totalGuests: 28, averagePartySize: 2.8 }
        ]);
      } else {
        setMenuItems([
          { name: 'Spicy Chicken Burger', orders: 45, popularity: 'High' },
          { name: 'Veggie Supreme Pizza', orders: 32, popularity: 'Medium' },
          { name: 'Classic Caesar Salad', orders: 28, popularity: 'Medium' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle report type changes
  useEffect(() => {
    // When switching report types, force chart update by setting a tiny delay
    // This ensures proper animations and transitions between chart types
    const timer = setTimeout(() => {
      // This state update will trigger a rerender of the chart components
      setLoading(false);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [reportType]);
  
  // Effect to refresh data when parameters change
  useEffect(() => {
    if (reportType === 'reservations' || reportType === 'menu') {
      // Reset the date range filters if needed
      // Keep the current date range selection to avoid confusion
    }
  }, [reportType]);

  // Calculate report statistics
  const reportStats = useMemo(() => {
    if (reportType === 'reservations' && reservations.length > 0) {
      const totalReservations = reservations.reduce((sum, day) => sum + day.totalReservations, 0);
      const totalGuests = reservations.reduce((sum, day) => sum + day.totalGuests, 0);
      const averagePartySize = totalReservations > 0 ? (totalGuests / totalReservations).toFixed(1) : 0;
      
      return {
        totalReservations,
        totalGuests,
        averagePartySize
      };
    }
    
    if (reportType === 'menu' && menuItems.length > 0) {
      const totalOrders = menuItems.reduce((sum, item) => sum + item.orders, 0);
      const mostPopular = [...menuItems].sort((a, b) => b.orders - a.orders)[0];
      
      return {
        totalOrders,
        mostPopular: mostPopular.name,
        mostPopularCount: mostPopular.orders
      };
    }
    
    return {};
  }, [reportType, reservations, menuItems]);
  // Generate chart data
  const generateChartData = (type, limit = null) => {
    if (type === 'reservations-line') {
      return {
        labels: reservations.map(r => r.date),
        datasets: [
          {
            label: 'Total Reservations',
            data: reservations.map(r => r.totalReservations),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 2,
            tension: 0.2
          },
          {
            label: 'Total Guests',
            data: reservations.map(r => r.totalGuests),
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 2,
            tension: 0.2
          }
        ]
      };
    } else if (type === 'reservations-party-size') {
      return {
        labels: ['1-2 People', '3-4 People', '5+ People'],
        datasets: [{
          label: 'Party Sizes',
          data: [
            reservations.filter(r => (r.totalGuests / r.totalReservations) <= 2).length,
            reservations.filter(r => (r.totalGuests / r.totalReservations) > 2 && (r.totalGuests / r.totalReservations) <= 4).length,
            reservations.filter(r => (r.totalGuests / r.totalReservations) > 4).length
          ],
          backgroundColor: [
            'rgba(99, 102, 241, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(217, 70, 239, 0.6)'
          ],
          borderColor: [
            'rgb(99, 102, 241)',
            'rgb(139, 92, 246)',
            'rgb(217, 70, 239)'
          ],
          borderWidth: 1
        }]
      };
    } else if (type === 'menu-bar') {
      const items = limit ? menuItems.slice(0, limit) : menuItems;
      return {
        labels: items.map(item => windowWidth < 768 && item.name.length > 15 
          ? item.name.substring(0, 15) + '...' 
          : item.name
        ),
        datasets: [{
          label: 'Orders',
          data: items.map(item => item.orders),
          backgroundColor: items.map(item => {
            if (item.popularity === 'High') return 'rgba(52, 211, 153, 0.7)';
            if (item.popularity === 'Medium') return 'rgba(251, 191, 36, 0.7)';
            return 'rgba(239, 68, 68, 0.7)';
          }),
          borderColor: items.map(item => {
            if (item.popularity === 'High') return 'rgb(16, 185, 129)';
            if (item.popularity === 'Medium') return 'rgb(245, 158, 11)';
            return 'rgb(220, 38, 38)';
          }),
          borderWidth: 1
        }]
      };
    } else if (type === 'menu-popularity') {
      return {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          label: 'Popularity',
          data: [
            menuItems.filter(item => item.popularity === 'High').length,
            menuItems.filter(item => item.popularity === 'Medium').length,
            menuItems.filter(item => item.popularity === 'Low').length
          ],
          backgroundColor: [
            'rgba(52, 211, 153, 0.7)',
            'rgba(251, 191, 36, 0.7)',
            'rgba(239, 68, 68, 0.7)'
          ],
          borderColor: [
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(220, 38, 38)'
          ],
          borderWidth: 1
        }]
      };
    }
    
    // Default empty chart data
    return {
      labels: [],
      datasets: []
    };
  };

  // Export report to CSV
  const exportToCSV = () => {
    let csvContent = '';
    let filename = '';
    
    if (reportType === 'reservations') {
      // Create CSV header
      csvContent = 'Date,Total Reservations,Total Guests,Average Party Size\n';
      
      // Add rows
      reservations.forEach(r => {
        csvContent += `${r.date},${r.totalReservations},${r.totalGuests},${(r.totalGuests / r.totalReservations).toFixed(1)}\n`;
      });
      
      filename = `reservations-report-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      // Create CSV header
      csvContent = 'Menu Item,Orders,Popularity\n';
      
      // Add rows
      menuItems.forEach(item => {
        csvContent += `"${item.name}",${item.orders},${item.popularity}\n`;
      });
      
      filename = `menu-report-${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-green-400 to-emerald-500">Reports & Analytics</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-300 font-medium">View your restaurant's performance metrics and generate reports</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={exportToCSV}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 hover:from-green-600 hover:via-green-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/30 p-4 rounded-xl text-red-700 dark:text-red-300 shadow-md">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Filter controls */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="reservations">Reservations</option>
              <option value="menu">Menu Popularity</option>
            </select>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last year</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
          {dateRange === 'custom' && (
            <>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Report summary cards */}
      {reportType === 'reservations' && reportStats.totalReservations !== undefined && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reservations</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reportStats.totalReservations}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Guests</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reportStats.totalGuests}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Party Size</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reportStats.averagePartySize}</p>
          </div>
        </div>
      )}

      {reportType === 'menu' && reportStats.totalOrders !== undefined && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reportStats.totalOrders}</p>
          </div>
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Popular Item</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reportStats.mostPopular}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{reportStats.mostPopularCount} orders</p>
          </div>
        </div>
      )}

      {/* Report data visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {reportType === 'reservations' ? 'Reservation Trends' : 'Menu Item Popularity'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {reportType === 'reservations' 
            ? `${reservations.length} days of reservation data${dateRange !== 'custom' ? ` (${dateRange})` : ''}`
            : `${menuItems.length} menu items analyzed${dateRange !== 'custom' ? ` (${dateRange})` : ''}`
          }
        </p>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="h-80">
            {reportType === 'reservations' && reservations.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Line chart for reservation trends */}
                <div className={windowWidth < 768 ? "w-full h-64 mb-6" : "w-full md:w-3/5 h-80"}>                  <Line 
                    data={generateChartData('reservations-line')}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: windowWidth < 768 ? 'bottom' : 'top',
                          labels: {
                            boxWidth: windowWidth < 768 ? 12 : 20,
                            font: { size: windowWidth < 768 ? 10 : 12 },
                            color: isDarkMode ? '#fff' : '#333'
                          }
                        },
                        title: {
                          display: true,
                          text: 'Reservation Trends',
                          color: isDarkMode ? '#fff' : '#333'
                        }
                      },
                      scales: {
                        x: {
                          ticks: {
                            maxRotation: windowWidth < 768 ? 90 : 0,
                            color: isDarkMode ? '#aaa' : '#666'
                          },
                          grid: {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          }
                        },
                        y: {
                          ticks: {
                            color: isDarkMode ? '#aaa' : '#666'
                          },
                          grid: {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          }
                        }
                      }
                    }}
                  />
                </div>
                {/* Pie chart for average party size */}
                <div className={windowWidth < 768 ? "w-full h-64" : "w-full md:w-2/5 h-80"}>                  <Pie
                    data={generateChartData('reservations-party-size')}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: windowWidth < 768 ? 12 : 20,
                            font: { size: windowWidth < 768 ? 10 : 12 },
                            color: isDarkMode ? '#fff' : '#333'
                          }
                        },
                        title: {
                          display: true,
                          text: 'Party Size Distribution',
                          color: isDarkMode ? '#fff' : '#333'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            ) : reportType === 'menu' && menuItems.length > 0 ? (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Bar chart for menu item orders */}
                <div className={windowWidth < 768 ? "w-full h-64 mb-6" : "w-full md:w-3/5 h-80"}>                  <Bar
                    data={generateChartData('menu-bar', windowWidth < 768 ? 5 : 10)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      indexAxis: 'y',
                      plugins: {
                        legend: {
                          display: false
                        },
                        title: {
                          display: true,
                          text: 'Most Ordered Menu Items',
                          color: isDarkMode ? '#fff' : '#333',
                          font: {
                            size: windowWidth < 768 ? 14 : 16
                          }
                        },
                        tooltip: {
                          callbacks: {
                            title: function(context) {
                              // Show full name in tooltip even if truncated in label
                              const index = context[0].dataIndex;
                              return menuItems[index].name;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: isDarkMode ? '#aaa' : '#666'
                          },
                          grid: {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          }
                        },
                        y: {
                          ticks: {
                            color: isDarkMode ? '#aaa' : '#666'
                          },
                          grid: {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          }
                        }
                      }
                    }}
                  />
                </div>
                {/* Pie chart for popularity distribution */}
                <div className={windowWidth < 768 ? "w-full h-64" : "w-full md:w-2/5 h-80"}>                  <Pie
                    data={generateChartData('menu-popularity')}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: windowWidth < 768 ? 12 : 20,
                            font: { size: windowWidth < 768 ? 10 : 12 },
                            color: isDarkMode ? '#fff' : '#333'
                          }
                        },
                        title: {
                          display: true,
                          text: 'Menu Item Popularity',
                          color: isDarkMode ? '#fff' : '#333',
                          font: {
                            size: windowWidth < 768 ? 14 : 16
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  No data available for the selected period
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report data table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {reportType === 'reservations' ? 'Reservation Data' : 'Menu Item Data'}
          </h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                {reportType === 'reservations' ? (
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Reservations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Guests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Average Party Size</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Menu Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Popularity</th>
                  </tr>
                )}
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reportType === 'reservations' ? (
                  reservations.length > 0 ? (
                    reservations.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{day.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{day.totalReservations}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{day.totalGuests}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {(day.totalGuests / day.totalReservations).toFixed(1)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No reservation data available for this period</td>
                    </tr>
                  )
                ) : (
                  menuItems.length > 0 ? (
                    menuItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.orders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.popularity === 'High' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                              : item.popularity === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                          }`}>
                            {item.popularity}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No menu item data available for this period</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
