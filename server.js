const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const userRouter = require("./routes/user-router");
const jobRouter = require("./routes/job-router");
const kaggleRouter = require("./routes/kaggle-router");
const app = express();
let cors = require("cors");
const port = process.env.PORT || 5000;

// const MongoClient = require('mongodb').MongoClient;
const uri =
  "mongodb+srv://Admin:RI2JBvI7gof0ODkH@cluster0.kdzl2.mongodb.net/dev?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const mongoose = require("mongoose");

mongoose.connect(uri, { useNewUrlParser: true }).catch((e) => {
  console.error("Connection error", e.message);
});

// eslint-disable-next-line no-unused-vars
const db = mongoose.connection;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});

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
