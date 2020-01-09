const express = require("express");
const users = require("../routes/users");
const contacts = require("../routes/contacts");
const auth = require("../routes/auth");
const unexpectedError = require("../middleware/unexpectedError");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/contacts", contacts);
  app.use(unexpectedError);
};
