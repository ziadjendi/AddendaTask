const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function(req, res, next) {
  const token = req.header("x-auth");
  if (!token) return res.status(401).send("No token provided, Access Denied!");
  try {
    const user = jwt.verify(token, config.get("jwtSecretKey"));
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Invalid token!!!");
  }
};
