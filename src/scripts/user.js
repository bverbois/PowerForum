const { MongoClient } = require("mongodb");

require("dotenv").config();
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;
const collectionName = "users";
const noPassword = { projection: { password: 0 } };
var fs = require("fs");
const path = require("path");

const express = require("express");
const { errorCheck } = require("./errorCheck");
const app = express();
const port = 3000;
app.listen(port);
console.log("Server started at http://localhost:" + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const client = new MongoClient(uri);

async function submitUser(userToCreate) {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const response = await collection.insertOne(userToCreate);
    console.log(response);
  } finally {
    await client.close();
  }
}

async function validateUser(userToValidate) {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const response = await collection.countDocuments(userToValidate, {
      projection: { limit: 1 },
    });
    const found = response > 0;
    console.log(response);
    console.log(found);
    return found;
  } finally {
    await client.close();
  }
}

app.post("/api/post/user", function (req, res) {
  console.log(`
    name: ${req.body.name} \n 
    username: ${req.body.username} \n 
    password: ${req.body.password} \n
    `);

  const userToCreate = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
  };

  submitUser(userToCreate);

  res.redirect("../user/login");
});

app.get("/user/create", function (req, res) {
  res.sendFile(path.join(__dirname, "../views/user-create.html"), (err) => {
    errorCheck(err);
  });
});

app.get("/user/login", function (req, res) {
  res.sendFile(path.join(__dirname, "../views/user-login.html"), (err) => {
    errorCheck(err);
  });
});

app.post("/api/validate", function (req, res) {
  const userToValidate = {
    username: req.body.username,
    password: req.body.password,
  };

  result = validateUser(userToValidate);
  if (result) {
    console.log("Validated");
    //res.redirect("../");
  }
});
