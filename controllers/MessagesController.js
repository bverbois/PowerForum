import { Database } from "../connections/database.js";
import { MongoClient, ObjectId } from "mongodb";

const collectionName = "topics";
const database = Database.getInstance();
const collection = database.collection(collectionName);

const topicId = "69d67a1217051fdcb86485e9";
const topicOid = new ObjectId(topicId);
const message = "I also went fishing the other day and I caught 3 bass :)";

// This is for creating a message/adding it to the topic's array of messages
// const messageOid = new ObjectId();
// const response = await collection.updateOne(
//   { _id: topicOid },
//   { $push: { messages: { _id: messageOid, body: message } } },
// );

// This is for updating a message
const messageOid = new ObjectId("69d67aef178a7e9f1753dab6");
const response = await collection.updateOne(
  { "messages._id": messageOid },
  { $set: { "messages.$.body": message } },
);

console.log(response);
