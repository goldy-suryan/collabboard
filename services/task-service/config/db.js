const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MONGODB connected');
  } catch (e) {
    console.log(e, 'error');
    process.exit(1);
  }
};

module.exports = connectDB;
