const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load .env
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
const connectDB = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10 // Maximum number of connections in the pool
    };

    try {
        await mongoose.connect(process.env.MONGO_URI, options);
        console.log('✅ MongoDB connected');

        // Connection event listeners
        mongoose.connection.on('error', err => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('ℹ️ MongoDB disconnected');
        });
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};
connectDB();

// Mount routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/categories', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Product Catalog API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
