const config = require("config");
const express = require("express");
const app = express();

require("./startup/db")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();

const port = process.env.PORT || config.get("port");
app.listen(port, () => console.log(`Application listennig on port: ${port}`));
