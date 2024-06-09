const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const routes = require("./routes/routes");
const app = express();
require('dotenv').config({path: path.resolve(__dirname, './config.env')});


const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}
@bug-tracker0.pjrt0sd.mongodb.net/?retryWrites=true&w=majority`;

const allowedDomains = ['https://bugtracker.jacob-ferrell.com', 'https://bug-tracker-rcf6.onrender.com']
if (process.env.NODE_ENV == "development") {
  allowedDomains.push("http://localhost:3000");
}

app.use(express.static(path.join(__dirname, "/build")));
//app.use(cors());
//app.use(cors({origin: 'https://bug-tracker-rcf6.onrender.com'}));
app.use(cors({
  origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);
 
    if (allowedDomains.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
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
