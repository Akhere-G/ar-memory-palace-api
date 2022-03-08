const app = require("./app");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;

const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Listening at port ${PORT}`)))
  .catch((err) => console.log(`Could not connect. ${err.message}`));
