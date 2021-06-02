const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("FreeCodeCamp Microservices");
});

//timestamp

app.get('/api', (req, res) => {
  const date = new Date();

  res.json({
    unix: date.valueOf(),
    utc: date.toUTCString(),
  });
})

app.get("/api/:time", (req, res) => {
  const { time } = req.params;

  let date;

  if (time.includes("-")) {
    const timeArr = time.split("-");
    date = new Date(...[timeArr]);
  } else date = new Date(+time);
  if (date.toUTCString() === "Invalid Date") res.json({ error: "Invalid Date" });
  res.json({
    unix: date.valueOf(),
    utc: date.toUTCString(),
  });
});

app.listen(4000, () => {
  console.log(`Listen on port 4000`);
});
