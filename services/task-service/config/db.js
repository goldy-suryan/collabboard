const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MONGODB connected');
  } catch (e) {
    console.log(e, 'error');
  }
};

module.exports = connectDB;
