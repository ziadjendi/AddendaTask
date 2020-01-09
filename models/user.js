const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    // unique: true, //deprecated we should create index instead
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    maxlength: 1000
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email
    },
    config.get("jwtSecretKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = function(user) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(3)
      .max(30)
      .trim()
      .lowercase(),
    email: Joi.string()
      .email()
      .required()
      .max(50)
      .lowercase()
      .trim(),
    password: Joi.string()
      .required()
      .min(8)
      .max(20),
    confirmPassword: Joi.ref("password")
  }).with("password", "confirmPassword");
  let { error } = schema.validate(user);
  if (error) error = error.details[0].message;
  return error;
};

module.exports = {
  User,
  validate
};
