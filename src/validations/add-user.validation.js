/* eslint-disable no-useless-escape */
const Joi = require('joi');

module.exports = Joi.object()
  .keys({
    first_name: Joi.string()
      .trim()
      .min(3)
      .max(255)
      .label('First Name'),
    last_name: Joi.string()
      .trim()
      .min(3)
      .max(255)
      .label('Last Name'),
    email_id: Joi.string()
      .max(255)
      .email({
        allowUnicode: true,
        tlds: false,
      }).required()
      .label('Email'),
    phone_no: Joi.string()
      .regex(/^[a-zA-Z0-9 #*()\-]+$/)
      .min(3)
      .max(32)
      .label('Phone No'),
  });
