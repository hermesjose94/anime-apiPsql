const Joi = require("@hapi/joi");

const userIdSchema = Joi.number().min(1);

const userCreateSchema = Joi.object({
  name: Joi.string().max(45).required(),
  avatar: Joi.string(),
  username: Joi.string().max(45).required(),
  email: Joi.string().max(45).required(),
  password: Joi.string().max(200).required(),
});

const userUpdateSchema = Joi.object({
  id: Joi.number().min(1).required(),
  name: Joi.string().max(45).required(),
  avatar: Joi.string(),
  username: Joi.string().max(45).required(),
  email: Joi.string().max(45).required(),
  password: Joi.string().max(200).required(),
});

module.exports = { userCreateSchema, userUpdateSchema, userIdSchema };
