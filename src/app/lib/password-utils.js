// This utility provides functions for secure password handling
import bcrypt from 'bcryptjs';

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
export const hashPassword = async (password) => {
  // Use bcrypt with a salt factor of 10
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Verify a password against a stored hash
 * @param {string} password - Plain text password to verify
 * @param {string} hashedPassword - Stored hashed password
 * @returns {boolean} - Whether password matches
 */
export const verifyPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    // If the stored password isn't a proper bcrypt hash, fall back to direct comparison
    // This is useful for migration or development only - remove in production
    console.warn('Password comparison error, falling back to direct comparison:', error);
    return password === hashedPassword;
  }
};

/**
 * Create a new admin in the database
 * @param {Object} supabase - Supabase client instance
 * @param {string} username - Admin username (ID)
 * @param {string} password - Plain text password
 * @param {Object} additionalFields - Additional admin fields (name, email, etc.)
 * @returns {Promise<Object>} - Result of operation
 */
export const createAdmin = async (supabase, username, password, additionalFields = {}) => {
  const hashedPassword = await hashPassword(password);
  
  return await supabase
    .from('admins')
    .insert([
      { 
        id: username, 
        password: hashedPassword,
        ...additionalFields,
        created_at: new Date().toISOString()
      }
    ]);
};
