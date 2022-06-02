"use strict";

const express = require(`express`);
const sequelize = require(`../lib/sequelize`);
const API_PREFIX = `/api`;
const {HttpCode, ExitCode} = require(`../../constants`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `server`});
const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res, next) => {
  res.on(`finish`, () => {
    logger.info(`Код статуса ответа ${res.statusCode}`);
  });
  next();
});

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`Маршрут не найден: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`Произошла ошибка при обработке запроса: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(port) {
    try {
      logger.info(`Попытка подключиться к базе данных...`);
      await sequelize.authenticate();
    } catch ({message}) {
      logger.error(
          `Произошла ошибка при подключении к базе данных: ${message}`
      );
      process.exit(ExitCode.error);
    }
    try {
      app
        .listen(port)
        .on(`listening`, () => {
          return console.info(`Запущено на http://localhost:${port}/`);
        })
        .on(`error`, ({message}) => {
          return console.error(
              `Произошла ошибка при создании сервера: ${message}`
          );
        });
    } catch (err) {
      process.exit(ExitCode.error);
    }
  },
};
