"use strict";

const Joi = require(`joi`);
const schemaValidator = require(`../lib/schema-validator`);

const STRING_MIN_LENGTH = 30;
const STRING_MAX_LENGTH = 250;

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория публикации`,
  TITLE_MIN: `Заголовок содержит меньше ${STRING_MIN_LENGTH} символов`,
  TITLE_MAX: `Заголовок не может содержать более ${STRING_MAX_LENGTH} символов`,
  ANNOUNCE_MIN: `Анонс содержит меньше ${STRING_MIN_LENGTH} символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более ${STRING_MAX_LENGTH} символов`,
  FULL_TEXT_MIN: `Текст публикации не может быть пустым`,
  FULL_TEXT_MAX: `Текст публикации не может содержать более 1000 символов`,
  PHOTO: `Тип изображения не поддерживается`,
  USER_ID: `Некорректный идентификатор пользователя`,
};

const imageRegexp = /.*\.(jpeg|jpg|png)$/;

const schema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": ErrorArticleMessage.USER_ID,
  }),
  categories: Joi.array()
    .items(
        Joi.number().integer().positive().messages({
          "number.base": ErrorArticleMessage.CATEGORIES,
        })
    )
    .min(1)
    .required(),
  title: Joi.string()
    .min(STRING_MIN_LENGTH)
    .max(STRING_MAX_LENGTH)
    .required()
    .messages({
      "string.empty": ErrorArticleMessage.TITLE_MIN,
      "string.min": ErrorArticleMessage.TITLE_MIN,
      "string.max": ErrorArticleMessage.TITLE_MAX,
    }),
  announce: Joi.string()
    .min(STRING_MIN_LENGTH)
    .max(STRING_MAX_LENGTH)
    .required()
    .messages({
      "string.empty": ErrorArticleMessage.ANNOUNCE_MIN,
      "string.min": ErrorArticleMessage.ANNOUNCE_MIN,
      "string.max": ErrorArticleMessage.ANNOUNCE_MAX,
    }),
  photo: Joi.string()
    .optional()
    .allow(``)
    .pattern(new RegExp(imageRegexp))
    .messages({
      "string.pattern.base": ErrorArticleMessage.PHOTO,
    }),
  fullText: Joi.string().optional().allow(null).allow(``).max(1000).messages({
    "string.max": ErrorArticleMessage.FULL_TEXT_MAX,
  }),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;

  return schemaValidator({
    res,
    cb: next,
    schema,
    data: newArticle,
    abortEarly: false,
  });
};
