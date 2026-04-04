import { MongoClient } from "mongodb";

import dotenv from "dotenv";
import express from "express";
import { errorCheck } from "./errorCheck.js";
import path from "path";

dotenv.config();

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;
const collectionName = "topics";

const app = express();
const port = 3000;
app.listen(port);
console.log("Server started at http://localhost:" + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/***************** NOTE *****************/
/* this line is very important. it is what
loads the script needed by the 
HTML file (src="../scripts/script.js")*/
app.use(express.static("src"));
/***************** NOTE *****************/

const client = new MongoClient(uri);

async function submitTopic(topicToCreate) {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const response = await collection.insertOne(topicToCreate);
    console.log(response);
  } finally {
    await client.close();
  }
}

app.post("/api/post/topic", function (req, res) {
  const topicToCreate = {
    name: req.body.name,
    description: req.body.description,
  };

  submitTopic(topicToCreate);

  res.redirect("/topics"); //Needs to redirect to a page showing the topic
});

app.get("/topic/create", function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "../views/topic-create.html"),
    (err) => {
      errorCheck(err);
    },
  );
});

app.get("/topics", function (req, res) {
  // const mainBody = document.getElementById("mainBody");
  // const newContent = document.createTextNode("Testing");
  // mainBody.appendChild(newContent);

  res.sendFile(
    path.join(import.meta.dirname, "../views/topics-display.html"),
    (err) => {
      errorCheck(err);
    },
  );
});
