const { MongoClient } = require("mongodb");

require('dotenv').config();
const uri = process.env.mongo_uri;
const dbName = process.env.mongo_db;
const collectionName = process.env.mongo_collection;
const noPassword = { projection: { password: 0 }};
var fs = require("fs");

const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log("Server started at http://localhost:" + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/user/create", function(req, res) {
  fs.readFile('./html/user-create.html', 'utf-8', (err, data) => {
    //console.log(data);
    if(err) {
      res.send('Error has occured: ', err);
    }
    res.send(data);
  })  
});


