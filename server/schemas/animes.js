const Joi = require("@hapi/joi");

const animeIdSchema = Joi.number().min(1);

const animeCreateSchema = Joi.object({
  name: Joi.string().max(100).required(),
  episode: Joi.number().min(1).max(10000).required(),
  date: Joi.string().max(45).required(),
  station: Joi.string().max(45).required(),
  cover: Joi.string().required(),
  description: Joi.string().required(),
  source: Joi.string().required(),
  status: Joi.string().max(100).required(),
  season: Joi.number().min(1).max(100).required(),
  premiere: Joi.string().max(10).required(),
});

const animeUpdateSchema = Joi.object({
  id: Joi.number().min(1).required(),
  name: Joi.string().max(100).required(),
  episode: Joi.number().min(1).max(10000).required(),
  date: Joi.string().max(45).required(),
  station: Joi.string().max(45).required(),
  cover: Joi.string().required(),
  description: Joi.string().required(),
  source: Joi.string().required(),
  status: Joi.string().max(100).required(),
  season: Joi.number().min(1).max(100).required(),
  premiere: Joi.string().max(10).required(),
});

// .messages({
//     "string.base": `"Día de estreno" debe ser de tipo 'text'`,
//     "string.max": `"Día de estreno" should have a maximum length of {#limit}`,
//     "any.required": `"Día de estreno" es un campo requerido`,
//   }),
module.exports = { animeCreateSchema, animeUpdateSchema, animeIdSchema };
