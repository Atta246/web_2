const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load environment variables if needed
try {
  if (fs.existsSync(path.join(__dirname, '.env.local'))) {
    console.log('Environment file (.env.local) found');
    
    // Load environment variables
    require('dotenv').config({ path: '.env.local' });
    
    // Validate OpenAI API key
    try {
      const validateOpenAIApiKey = require('./validate-openai-key');
      validateOpenAIApiKey();
    } catch (apiError) {
      console.warn('\x1b[33m%s\x1b[0m', 'OpenAI API validation skipped:', apiError.message);
    }
  }
} catch (err) {
  console.warn('\x1b[33m%s\x1b[0m', 'Could not check environment configuration:', err.message);
}

// Connect to MongoDB
// For production, use environment variables for MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  featured: { type: Boolean, default: false }
});

// Define Reservation Schema
const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  message: { type: String },
  status: { type: String, default: 'pending' }
});

// Define User Schema for Admin authentication
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

// Models
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, 'SECRET_KEY', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Menu Routes
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
});

app.post('/api/menu', authenticateToken, async (req, res) => {
  try {
    const newMenuItem = new MenuItem(req.body);
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating menu item', error: error.message });
  }
});

app.put('/api/menu/:id', authenticateToken, async (req, res) => {
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating menu item', error: error.message });
  }
});

app.delete('/api/menu/:id', authenticateToken, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting menu item', error: error.message });
  }
});

// Reservation Routes
app.get('/api/reservations', authenticateToken, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating reservation', error: error.message });
  }
});

app.put('/api/reservations/:id', authenticateToken, async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating reservation', error: error.message });
  }
});

app.delete('/api/reservations/:id', authenticateToken, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting reservation', error: error.message });
  }
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    // Create and sign token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      'SECRET_KEY',
      { expiresIn: '1h' }
    );
    
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create default admin if no users exist
const createAdminUser = async () => {
  try {
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Uncomment when MongoDB is configured
  // createAdminUser();
});

module.exports = app;
