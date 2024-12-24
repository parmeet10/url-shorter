import express from 'express';

const app = express();

// Include config files
import config from './configs/config.js';
import status from './configs/status.js';

// Include middleware
import authsMiddleware from './middlewares/auth.js';

// Include routers
import authsRouter from './routes/auths.js';
import urlsRouter from './routes/urls.js';
import analyticsRouter from './routes/analytics.js';

// Use JSON body parser
app.use(express.json());

// DB status check
const dbSelfCheck = async () => {
  const dbSelfCheckQuery = config.knex.select(config.knex.raw('now()'));

  try {
    await dbSelfCheckQuery;
    console.log('SQL-DATABASE is up and running');
  } catch (err) {
    console.log('DATABASE ERROR:', err);
  }
};

dbSelfCheck();

// HANDLE CORS
app.use((req, res, next) => {
  // Set the allowed HTTP methods that the server can handle
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  next();
});

// Healthcheck routes
app.get('/ping', (req, res) => {
  res.send('pong');
});

// use middlware
app.use(authsMiddleware);

// Routes
app.use('/auths', authsRouter);
app.use('/api', urlsRouter);
app.use('/api/analytics', analyticsRouter);

// Catch 404s
app.use((req, res) => {
  console.log('asas');
  res.status(404).json(status.getStatus('url_missing'));
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err) {
    console.log(new Date().toISOString(), err);
    res.json(err);
  } else {
    const errorResponse = status.getStatus('generic_fail');
    res.json(errorResponse);
  }
});

app.listen(config.SERVER_PORT, () => {
  console.log(`${new Date()}`);
  console.log(`########## Environment: ${process.env.NODE_ENV} ##########`);
  console.log(`Server running at port: ${config.SERVER_PORT}`);
});
