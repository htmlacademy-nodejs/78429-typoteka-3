"use strict";

const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports = {
  USER_ARGV_INDEX,
  HttpCode,
  MAX_ID_LENGTH,
  Env
};
