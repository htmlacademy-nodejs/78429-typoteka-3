"use strict";

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const schemaValidator = require(`../lib/schema-validator`);

const PASSWORD_MIN_LENGTH = 6;

const ErrorRegisterMessage = {
  FIRST_NAME: `Имя содержит некорректные символы`,
  LAST_NAME: `Имя содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше ${PASSWORD_MIN_LENGTH}-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Тип изображения не поддерживается`,
};

const imageRegexp = /.*\.(jpeg|jpg|png)$/; // регулярка для изображения
const nameRegexp = /[^0-9$&+,:;=?@#|'<>.^*()%!]+$/; // регулярка для имени и фамилии

const nameSchema = (errorMessage) =>
  Joi.string()
    .pattern(nameRegexp)
    .required()
    .messages({
      "string.pattern.base": errorMessage,
    });

const schema = Joi.object({
  firstName: nameSchema(ErrorRegisterMessage.FIRST_NAME),
  lastName: nameSchema(ErrorRegisterMessage.LAST_NAME),
  email: Joi.string().email().required().messages({
    "string.email": ErrorRegisterMessage.EMAIL,
  }),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).required().messages({
    "string.min": ErrorRegisterMessage.PASSWORD,
  }),
  passwordRepeated: Joi.string()
    .valid(Joi.ref(`password`))
    .required()
    .messages({
      "any.only": ErrorRegisterMessage.PASSWORD_REPEATED,
    }),
  avatar: Joi.string()
    .allow(null)
    .allow(``)
    .optional()
    .pattern(new RegExp(imageRegexp))
    .messages({
      "string.empty": ErrorRegisterMessage.AVATAR,
    }),
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;

  return schemaValidator({
    res,
    cb: async () => {
      const userByEmail = await service.findByEmail(req.body.email);

      if (userByEmail) {
        return res
          .status(HttpCode.BAD_REQUEST)
          .send(ErrorRegisterMessage.EMAIL_EXIST);
      }

      return next();
    },
    schema,
    data: newUser,
    abortEarly: false,
  });
};
