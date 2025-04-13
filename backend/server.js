const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/tokens', require('./src/api/tokenRoutes'));
app.use('/api/wallet', require('./src/api/walletRoutes'));
app.use('/api/transactions', require('./src/api/transactionRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MemePad Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 