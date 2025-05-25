'use client';

import { useState, useEffect } from 'react';

export default function LoginDebugger() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const response = await fetch('/api/admin/debug/admins', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setAdminData(data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to fetch admin data. Check the console for details.');
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  const testLogin = async (id, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: id, password }),
      });

      const data = await response.json();
      
      alert(response.ok 
        ? `Login successful! Token: ${data.token.substring(0, 10)}...` 
        : `Login failed: ${data.error}`
      );
      
    } catch (err) {
      alert(`Error during login test: ${err.message}`);
    }
  };

  if (loading) return <div className="p-4">Loading admin data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 mt-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Admin Login Debugger</h3>
      
      {adminData?.admins?.length > 0 ? (
        <div>
          <p className="mb-2">Found {adminData.admins.length} admins in database:</p>
          <ul className="mb-4">
            {adminData.admins.map((admin, index) => (
              <li key={index} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
                <div><strong>ID:</strong> {admin.id}</div>
                <div><strong>Username:</strong> {admin.username || 'none'}</div>
                <div><strong>Password:</strong> {admin.password}</div>
                <button 
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm"
                  onClick={() => testLogin(admin.id, admin.password)}
                >
                  Test Login with ID
                </button>
                {admin.username && (
                  <button 
                    className="mt-2 ml-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    onClick={() => testLogin(admin.username, admin.password)}
                  >
                    Test Login with Username
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500">Note: This debugger is for development only and should not be deployed to production.</p>
        </div>
      ) : (
        <p>No admin accounts found in the database.</p>
      )}
    </div>
  );
}
