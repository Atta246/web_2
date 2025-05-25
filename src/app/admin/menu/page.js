'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, AuthProvider } from '../../context/AuthContext';
import { menuService } from '../../services/api';
import { formatMenuItem, formatMenuItemForDb, formatPrice, getMenuCategories } from '../../lib/menu-utils';

// Fallback menu data in case API fails
const fallbackMenuItems = [
  {
    id: 1,
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
    price: 24.99,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil',
    price: 18.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
  },
  {
    id: 3,
    name: 'Beef Tenderloin',
    description: 'Prime beef tenderloin with red wine reduction and truffle mashed potatoes',
    price: 32.99,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
  },
  {
    id: 4,
    name: 'Shrimp Pasta',
    description: 'Linguine with jumbo shrimp, cherry tomatoes, garlic, and white wine sauce',
    price: 22.99,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8'
  },
  {
    id: 5,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
    price: 12.99,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74'
  }
];

function MenuManagement() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState(fallbackMenuItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Starters',
    category_id: null,
    image: '',
    image_url: '',
    is_available: true,
    is_featured: false,
    preparation_time: 15
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (authLoading || !user) return; // Don't fetch if not authenticated yet

      try {
        setLoading(true);
        const data = await menuService.getAllItems();
        setMenuItems(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Using fallback data.');
        // Keep fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [user, authLoading]);

  // Get all unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  // Filter menu items based on category and search term
  const filteredMenuItems = menuItems.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Open modal to add new item
  const handleAddItem = () => {
    setSelectedItem(null);
    setModalMode('add');
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Starters',
      image: '',
      image_url: '',
      is_available: true,
      is_featured: false,
      preparation_time: 15
    });
    setIsModalOpen(true);
  };

  // Open modal to edit existing item
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setModalMode('edit');
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      category_id: item.category_id || null,
      image: item.image || item.image_url || '',
      image_url: item.image_url || item.image || '',
      is_available: item.is_available !== false,
      is_featured: item.is_featured || false,
      preparation_time: item.preparation_time || 15
    });
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'price' ? (value === '' ? '' : parseFloat(value)) : 
              name === 'preparation_time' ? (value === '' ? 0 : parseInt(value, 10)) : 
              value
    }));
  };  // Submit form to add or edit item
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || formData.price === '' || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Validate preparation time
    if (formData.preparation_time !== null && 
        (isNaN(formData.preparation_time) || formData.preparation_time < 0)) {
      alert('Preparation time must be a positive number');
      return;
    }

    // Validate price
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      alert('Price must be a valid positive number');
      return;
    }

    setActionLoading(true);

    try {
      // Prepare data for submission, ensuring image is properly set
      const submissionData = {
        ...formData,
        image_url: formData.image || formData.image_url
      };
      
      if (modalMode === 'add') {
        // Add new item via API
        const newItem = await menuService.createItem(submissionData);
        setMenuItems(prev => [...prev, newItem]);
      } else {
        // Edit existing item via API
        const updatedItem = await menuService.updateItem(selectedItem.id, submissionData);
        setMenuItems(prev => prev.map(item => 
          item.id === selectedItem.id ? updatedItem : item
        ));
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving menu item:', err);
      alert(`Failed to ${modalMode === 'add' ? 'add' : 'update'} menu item. ${err.message || 'Please try again.'}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete item
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    setActionLoading(true);

    try {
      // Delete item via API
      await menuService.deleteItem(selectedItem.id);
      
      // Remove item from state
      setMenuItems(prev => prev.filter(item => item.id !== selectedItem.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert('Failed to delete menu item. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Menu Management</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Add, edit, or remove items from your restaurant menu</p>
        </div>
        <button
          onClick={handleAddItem}
          className="mt-4 md:mt-0 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Menu Item
        </button>
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full px-4 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute right-3 top-2.5 text-gray-400 dark:text-gray-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading menu items...</p>
          </div>
        ) : error && menuItems.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : filteredMenuItems.length === 0 ? (
          <div className="py-20 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">No menu items found. Try a different search term or category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMenuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {(item.image || item.image_url) && (
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cover bg-center" 
                               style={{ backgroundImage: `url(${item.image || item.image_url})` }} />
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name} 
                            {!item.is_available && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                Unavailable
                              </span>
                            )}
                            {item.is_featured && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => !actionLoading && setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleFormSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    {modalMode === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category *
                        </label>
                        <select
                          name="category"
                          id="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select a category</option>
                          <option value="Starters">Starters</option>
                          <option value="Mains">Mains</option>
                          <option value="Pasta">Pasta</option>
                          <option value="Pizza">Pizza</option>
                          <option value="Desserts">Desserts</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        id="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="preparation_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Preparation Time (minutes)
                        </label>
                        <input
                          type="number"
                          name="preparation_time"
                          id="preparation_time"
                          min="1"
                          value={formData.preparation_time}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col justify-end space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_available"
                            id="is_available"
                            checked={formData.is_available}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                            className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Available
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_featured"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                            className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Featured Item
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-500 text-base font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : modalMode === 'add' ? 'Add Item' : 'Update Item'}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => !actionLoading && setIsDeleteModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Delete Menu Item
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete the menu item "{selectedItem.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={actionLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={handleDeleteConfirm}
                >
                  {actionLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : 'Delete'}
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}    </div>
  );
}

// Wrap the menu component with AuthProvider
const MenuPage = () => {
  return (
    <AuthProvider>
      <MenuManagement />
    </AuthProvider>
  );
};

export default MenuPage;
