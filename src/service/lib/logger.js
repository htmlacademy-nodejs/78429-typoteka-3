"use strict";

const pino = require(`pino`);
const {Env} = require(`../../constants`);

const LOG_FILE = `./logs/api.log`;
const isDev = process.env.NODE_ENV !== Env.PRODUCTION;
const defaultLogLevel = isDev ? `info` : `error`;

const logger = pino(
    {
      name: `base-logger`,
      level: process.env.LOG_LEVEL || defaultLogLevel,
      ...(isDev
        ? {
          transport: {
            target: `pino-pretty`,
          },
        }
        : {}),
    },
    isDev ? process.stdout : pino.destination(LOG_FILE)
);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  },
};
