const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const catchError = require("../middleware/catchError");
const router = require("express").Router();

router.post(
  "/",
  catchError(async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send("This email already exist in our Database");

    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res
      .header("x-auth", token)
      .header("access-control-expose-headers", "x-auth")
      .send(_.pick(user, ["_id", "name", "email"]));
  })
);

module.exports = router;
