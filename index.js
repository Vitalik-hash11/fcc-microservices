const express = require("express");
const app = express();

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

app.listen(4000, () => {
  console.log(`Listen on port 4000`);
});
