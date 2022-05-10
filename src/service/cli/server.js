"use strict";

const express = require(`express`);
const API_PREFIX = `/api`;
const {HttpCode} = require(`../../constants`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `server`});
const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res, next) => {
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  run(port) {
    try {
      app
        .listen(port)
        .on(`listening`, () => {
          return console.info(`Listening to connections on http://localhost:${port}/`);
        })
        .on(`error`, ({message}) => {
          return console.error(`An error occurred on server creation: ${message}`);
        });
    } catch (err) {
      process.exit(1);
    }
  },
};
