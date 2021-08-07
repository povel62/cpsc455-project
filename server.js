const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const userRouter = require("./routes/user-router");
const jobRouter = require("./routes/job-router");
const kaggleRouter = require("./routes/kaggle-router");
const app = express();
let cors = require("cors");
const port = process.env.PORT || 5000;
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGOURI;
const mongoose = require("mongoose");

mongoose.connect(uri, { useNewUrlParser: true }).catch((e) => {
  console.error("Connection error", e.message);
});

// eslint-disable-next-line no-unused-vars
const db = mongoose.connection;
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userRouter);
app.use("/api", jobRouter);
app.use("/api", kaggleRouter);

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
