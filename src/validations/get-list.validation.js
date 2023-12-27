/* eslint-disable no-useless-escape */
const Joi = require('joi');

module.exports = Joi.object()
  .keys({
    page_no: Joi.number()
      .integer()
      .positive().default(1)
      .label('Page Number'),
    page_size: Joi.number()
      .integer()
      .positive().default(100)
      .label('Page Size'),
    sort_by: Joi.string()
      .lowercase().default('created_at').label('Sort By'),
    sort_order: Joi.string()
      .min(3)
      .max(4)
      .lowercase()
      .valid('asc', 'desc')
      .default('desc')
      .label('Sort Order'),
    status: Joi.number()
      .integer().valid(1, 2).label('Status'),
    search: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .allow('')
      .label('Search Query'),
    ids: Joi.array().items(Joi.number()
      .integer()
      .positive()).label('Ids'),
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
      }).label('Email'),
    phone_no: Joi.string()
      .regex(/^[a-zA-Z0-9 #*()\-]+$/)
      .min(3)
      .max(32)
      .label('Phone No'),

  })
  .unknown(true);
