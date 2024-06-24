const express = require("express");
const cors = require("cors");
resolve = require("path").resolve;

const app = express();
app.use(cors());
app.use(express.static(resolve("../client")));

app.get("/home", (req, res) => {
  res.sendFile(resolve("../client/index.html"));
});

app.listen(3030, () => console.log("Server started on port" + "3030"));
