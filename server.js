const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const routes = require("./routes/routes");
const app = express();

const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}
@bug-tracker0.pjrt0sd.mongodb.net/?retryWrites=true&w=majority`;


app.use(express.static(path.join(__dirname, "/build")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
Object.keys(routes).forEach((folder) => {
  routes[folder].forEach((route) =>
    app.use(require(`./routes/${folder}/${route}`))
  );
});
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(process.env.PORT, () => console.log("Server is up"));
  })
  .catch((err) => console.log(err));
