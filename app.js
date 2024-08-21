require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const router = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const ApiError = require("./helpers/errorHandler");
const { PORT } = process.env;

const app = express();

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/files", express.static(path.join(__dirname, "files")));
app.use("/reports", express.static(path.join(__dirname, "reports")));
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens["remote-addr"](req, res),
      tokens["remote-user"](req, res),
      tokens["user-agent"](req, res),
      tokens.res(req, res, "content-length"),
      "-",
      JSON.stringify(req.headers),
      JSON.stringify(req.body),
      JSON.stringify(req.query),
      JSON.stringify(req.params),
      JSON.stringify(req.cookies),
      JSON.stringify(req.signedCookies),
      new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

app.use(express.json()); // read body type json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use("/api/v1", router);

app.use((req, res, next) => {
  next(ApiError.notFound("Page not found!"));
});

app.use((error, req, res, next) => {
  console.log("Error:", error.message);
  return res.status(error.status || error.code || 500).send(error);
});

app
  .listen(PORT, () => console.log(`Listening on port ${PORT}`))
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Failed to start server, port ${PORT} already in use`);
    } else {
      console.error(err);
    }
  });
