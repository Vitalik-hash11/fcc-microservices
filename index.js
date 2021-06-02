const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const MONGO_URI = require("./env.js");
const app = express();

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use("/public", express.static(`${process.cwd()}/public`));

console.log(MONGO_URI);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  title: String,
  shortUrl: Number,
});

const Url = mongoose.model("Url", urlSchema);

app.get("/", (req, res) => {
  res.send("FreeCodeCamp Microservices");
});

//timestamp

app.get("/api/timestamp", (req, res) => {
  const date = new Date();

  res.json({
    unix: date.valueOf(),
    utc: date.toUTCString(),
  });
});

app.get("/api/timestamp/:time", (req, res) => {
  const { time } = req.params;

  let date;

  if (time.includes("-")) date = new Date(time);
  else date = new Date(+time);

  if (date.toUTCString() === "Invalid Date")
    res.json({ error: "Invalid Date" });

  res.json({
    unix: date.valueOf(),
    utc: date.toUTCString(),
  });
});

//Request Header Parser Microservice

app.get("/api/whoami", (req, res) => {
  res.json({
    ipaddress:
      (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
      req.socket.remoteAddress,
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

// URL Shortener Microservice

app
  .route("/api/shorturl")
  .get((req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  })
  .post((req, res) => {
    const { url } = req.body;
    Url.estimatedDocumentCount()
      .exec()
      .then((data) => {
        const link = new Url({ title: url, shortUrl: ++data });
        link.save((err, url) => {
          if (err) throw new Error();
          res.json({ title: url.title, shortUrl: url.shortUrl });
        });
      })
      .catch((err) => console.log(err));
  });

app.get("/api/shorturl/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  Url.findOne({ shortUrl }).exec((err, url) => {
    if (err) throw new Error(err);
    res.redirect(url.title);
  });
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(4000, () => {
    console.log(`Listen on port 4000`);
  });
});
