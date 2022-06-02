'use strict';

const ensureArray = (value) =>
  Array.isArray(value) ? value : [value];

module.exports = ensureArray;
