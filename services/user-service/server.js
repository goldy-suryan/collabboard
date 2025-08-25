const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoute = require('./routes/user-route');
const { notFound, unknownError } = require('./middlewares/errorMiddleware.js');
dotenv.config();

const port = process.env.port || 3002;
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRoute);

app.use(notFound);
app.use(unknownError);

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err, 'error while connecting user service');
    process.exit(1);
  }
  console.log(`User server listening on port: ${port}`);
});
