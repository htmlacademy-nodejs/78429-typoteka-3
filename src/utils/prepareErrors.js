"use strict";

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

module.exports = prepareErrors;
