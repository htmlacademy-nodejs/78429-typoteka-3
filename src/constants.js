"use strict";

const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;

const MockConf = {
  DEFAULT_COUNT: 20,
  MAX_COUNT: 1000,
  MAX_MOUNTH_DIFF: 3,
  MAX_COMMENTS: 4,
  MAX_SENTENCES: 5,
  DATE_FORMAT: `YYYY-MM-DD hh:mm:ss`,
  FORMATTED_DATE_FORMAT: `DD MMM YYYY в HH:mm`,
};

const ExitCode = {
  error: 1,
  success: 0,
};

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
  PRODUCTION: `production`,
};

const View = {
  ARTICLES_PER_PAGE: 8,
  LATEST_COMMENTS_COUNT: 4
};

module.exports = {
  MockConf,
  USER_ARGV_INDEX,
  ExitCode,
  HttpCode,
  MAX_ID_LENGTH,
  Env,
  View,
};
