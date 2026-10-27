const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aarvik';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[AARVIK DB] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`[AARVIK DB] MongoDB Connection Error: ${error.message}`);
    console.warn(
      `[AARVIK DB TIP] Please make sure a local MongoDB service is running (mongod) or configure MONGODB_URI in backend/.env with a valid MongoDB Atlas connection string.`
    );
    // In production we would exit, but for dev we let server handle requests gracefully
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[AARVIK DB] MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('[AARVIK DB] MongoDB reconnected.');
});

const getDBStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || null,
  name: mongoose.connection.name || null,
});

module.exports = { connectDB, getDBStatus };
