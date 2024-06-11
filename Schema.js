const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(100)
      .error(new Error("Title must be between 3 and 100 characters")),

    description: Joi.string()
      .required()
      .trim()
      .min(10)
      .max(500)
      .error(new Error("Description must be between 10 and 500 characters")),

    location: Joi.string()
      .required()
      .trim()
      .min(3)
      .max(50)
      .error(new Error("Location must be between 3 and 50 characters")),

    country: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(50)
      .error(new Error("Country must be between 2 and 50 characters")),

    price: Joi.number()
      .required()
      .min(0)
      .error(new Error("Price must be a non-negative number")),

    image: Joi.object({
      url: Joi.string().allow("", null),
    }),
  }).required(),
});
