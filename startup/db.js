const config = require("config");
const mongoose = require("mongoose");

module.exports = function() {
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("Connected to DB"))
    .catch(console.error);
};
