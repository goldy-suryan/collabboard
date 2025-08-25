const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MONGODB connected');
  } catch (e) {
    console.log(e, 'error');
    process.exit(1);
  }
};

module.exports = connectDB;
