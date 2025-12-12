import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Force IPv4 and proper connection settings
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/hospital-ai', {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
      directConnection: true, // Direct connection to MongoDB
    });

    console.log('✅ MongoDB connected successfully');
    console.log(`📍 MongoDB Host: ${conn.connection.host}`);
    console.log(`📊 MongoDB Database: ${conn.connection.name}`);

    // Test the connection with a simple operation
    await mongoose.connection.db.admin().ping();
    console.log('✅ MongoDB ping successful');

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Make sure MongoDB is running: mongod');
    process.exit(1);
  }
};

export default connectDB;
