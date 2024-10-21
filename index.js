require("dotenv").config();

const express = require("express");
var bodyParser = require("body-parser");
const expressIp = require("express-ip");

const cors = require("cors");
const api = require("./routes/routes");
// const { fireBaseTokenVerify } = require("./utils/tokenVerification");

const app = express();

app.use(expressIp().getIpInfoMiddleware);
app.use(express.json({ limit: "20mb" }));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false, limit: "20mb" }));

let whitelist;
try {
  whitelist = JSON.parse(process.env.WHITELIST_DOMAINS);
} catch (error) {
  console.error("Error parsing WHITELIST_DOMAINS:", error);
  process.exit(1);
}

var corsOptions = {
  origin: function (origin, callback) {
    if (
      process.env.NODE_ENV == "development" ||
      process.env.NODE_ENV == "deploypment"
    ) {
      callback(null, true);
    } else {
      if (whitelist?.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Unauthorized Domain"));
      }
    }
  },
};
app.use(cors(corsOptions));
app.use((err, req, res, next) => {
  if (err) {
    return res.status(403).json({ error: err.message });
  }
  next();
});
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    "Access-Control-Allow-Headers":
      "Origin, Content-Type, Accept, Authorization, X-Requested-With, X-Auth-Token, Content-Disposition",
  });
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const init = async () => {
  // app.post("/api/verify-token", fireBaseTokenVerify);

  app.use("/api/v1", api);

  app.listen(process.env.PORT, () => {
    console.log(`app running on ${process.env.PORT}`);
  });
};
init();
