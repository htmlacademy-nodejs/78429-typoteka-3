"use strict";

const Joi = require(`joi`);
const schemaValidator = require(`../lib/schema-validator`);

const NAME_MIN_LENGTH = 5;
const NAME_MAX_LENGTH = 30;

const ErrorCategoryMessage = {
  MIN_TEXT: `Название категории содержит меньше ${NAME_MIN_LENGTH} символов`,
  MAX_TEXT: `Название категории содержит больше ${NAME_MAX_LENGTH} символов`,
};

const schema = Joi.object({
  name: Joi.string().trim().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required().messages({
    "string.empty": ErrorCategoryMessage.MIN_TEXT,
    "string.min": ErrorCategoryMessage.MIN_TEXT,
    "string.max": ErrorCategoryMessage.MAX_TEXT,
  }),
});

module.exports = async (req, res, next) => {
  const category = req.body;

  return schemaValidator({
    res,
    cb: next,
    schema,
    data: category,
    abortEarly: false,
  });
};
