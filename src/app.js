/* eslint-disable no-unused-vars */
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const { error } = require('./utils');
const config = require('./config');
const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'pong' });
});

// use routes
app.use(apiRoutes);

// global error handler
app.use(error.handler);

const server = app.listen(config.APP_PORT, config.APP_HOST, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  // eslint-disable-next-line no-console
  console.info(`Server running on http://${config.APP_HOST}:${config.APP_PORT}`);
});

module.exports = app;
