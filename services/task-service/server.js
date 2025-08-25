const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { runKafkaProducer } = require('./config/kafka');
dotenv.config();

const connectDB = require('./config/db');
const taskRoute = require('./routes/taskRoute');
const errorMiddleware = require('./middlewares/errorMiddleware');

const port = process.env.PORT || 8000;
const loggingFile = fs.createWriteStream(path.join(__dirname, 'access.log'));
const app = express();

// Connection to Database
connectDB();
runKafkaProducer();

//Middlewares
app.use(express.json());
app.use(logger('combined', { stream: loggingFile }));
app.use(cors());

//Routes
app.use('/task', taskRoute);

// Error Handler
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.unknownError);

//Server
app.listen(port, '0.0.0.0', (err) => {
  if (err) console.error(`Error while starting server: ${err}`);
  console.log(`Task server listening on port: ${port}`);
});
