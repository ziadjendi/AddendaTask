const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchError = require("../middleware/catchError");
const { User } = require("../models/user");
const router = require("express").Router();
router.post(
  "/",
  catchError(async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken();
    res.status(200).send(token);
  })
);

const validate = req => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .max(50)
      .lowercase()
      .trim(),
    password: Joi.string()
      .required()
      .min(8)
      .max(20)
  });

  let { error } = schema.validate(req);
  if (error) error = error.details[0].message;
  return error;
};
module.exports = router;
