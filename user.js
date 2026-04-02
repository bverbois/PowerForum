const { MongoClient } = require("mongodb");

require('dotenv').config();
const uri = process.env.mongo_uri;
const dbName = process.env.mongo_db;
const collectionName = "users";
const noPassword = { projection: { password: 0 }};
var fs = require("fs");
const path = require('path');

const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log("Server started at http://localhost:" + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const client = new MongoClient(uri);

async function submitUser(submission) {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const response = await collection.insertOne(submission);
    console.log(response);

  } finally {
    await client.close();
  }
}

async function validateUser(submission) {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const response = await collection.countDocuments(submission, { projection: { limit: 1 } });
    const found = response > 0;
    console.log(response);
    console.log(found);
    return found;    
  } finally {
    await client.close();
  }
  
}

app.post("/post/user", function(req, res) {
  console.log(`
    name: ${req.body.name} \n 
    username: ${req.body.username} \n 
    password: ${req.body.password} \n
    `
  );
  
  const submission = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
  }; 

  submitUser(submission);

  res.redirect("../user/login");
});

app.get("/user/create", function(req, res) {
  fs.readFile('user-create.html', 'utf8', (err, data) => {
    if(err) {
      res.send('Error has occured: ', err);
    }
    res.send(data);
  })  
});

app.get("/user/login", function(req, res) {
  // fs.readFile('user-login.html', 'utf8', (err, data) => {
  //   console.log(data);
  //   if(err) {
  //     res.send('Error has occured: ', err);
  //   }
  //   res.send(data);
  // });

  //sendFile seems better, don't need extra import for fs
  res.sendFile(path.join(__dirname, 'user-login.html'), (err) => {
      if(err) {
        return res.send('Error has occured: ', err);
      } else {        

        console.log("Success!");               

      }      
    }
  );  
});

app.post("/validate", function(req, res) {
  const submission = {
    username: req.body.username,
    password: req.body.password,
  };

  result = validateUser(submission);
  if(result) {
    console.log("Validated");
    //res.redirect("../");
  }  

});