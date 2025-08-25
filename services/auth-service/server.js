const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { notFound, unknownError } = require('./middlewares/errorMiddleware');
const loginRoute = require('./routes/login-route');
const registerRoute = require('./routes/register-route');
const authenticatedRoute = require('./routes/authenticated-route');
dotenv.config();

const port = process.env.port;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/isAuthenticated', authenticatedRoute);

app.use(notFound);
app.use(unknownError);

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err, 'error while connecting auth service');
    process.exit(1);
  }
  console.log(`Auth server listening on port: ${port}`);
});
