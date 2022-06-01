"use strict";

const Sequelize = require(`sequelize`);
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

module.exports = (() => {
  const somethingIsNotDefined = [
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
  ].some((it) => it === undefined);

  if (somethingIsNotDefined) {
    throw new Error(`Одна или несколько переменных окружения не определены`);
  }

  return new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: `postgres`,
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 10000,
    },
  });
})();
