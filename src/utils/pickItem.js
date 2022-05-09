'use strict';

const getRandomInt = require(`./randomInt`);

const pickItem = (arr) => {
  if (!Array.isArray(arr)) {
    return false;
  }
  return arr[getRandomInt(0, arr.length - 1)];
};

module.exports = pickItem;
