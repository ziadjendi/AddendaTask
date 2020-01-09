const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  user: {
    type: {
      _id: {
        type: mongoose.Types.ObjectId,
        required: true
      },
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
      }
    }
  }
});

const Contact = mongoose.model("Contact", contactSchema);

const validate = function(contact) {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(20)
      .required(),
    phone: Joi.number()
      .integer()
      .positive()
      .required()
  });
  let { error } = schema.validate(contact);
  if (error) error = error.details[0].message;
  return error;
};

module.exports = {
  Contact,
  validate
};
