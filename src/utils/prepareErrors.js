"use strict";

const prepareErrors = (errors) => errors.response.data.split(`\n`);

module.exports = prepareErrors;
