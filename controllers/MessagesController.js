import { Database } from "../connections/database.js";
import { MongoClient, ObjectId } from "mongodb";
import { forumEmmitter } from "../events.js";

const collectionName = "topics";
const database = Database.getInstance();
const topicsCollection = database.collection(collectionName);
const usersCollection = database.collection("users");

// const topicOid = new ObjectId(topicId);

// This is for creating a message/adding it to the topic's array of messages
// const messageOid = new ObjectId("69d6e4fa13ce9437dd55e8c1");
// const response = await collection.updateOne(
//   { _id: topicOid },
//   { $push: { messages: { _id: messageOid, body: message } } },
// );

// // This is for updating a message
// const messageOid = new ObjectId("69d67aef178a7e9f1753dab6");
// const response = await collection.updateOne(
//   { "messages._id": messageOid },
//   { $set: { "messages.$.body": message } },
// );

//This is logic to ultimately get a single message from
//a JSON string of topics.
// const topic = await collection.findOne({ _id: topicOid });

// const createdMessage = topic.messages.find(
//   (msg) => msg._id.toString() === "69d6e4fa13ce9437dd55e8c1",
// );

export async function submitMessage(request, user) {
  const userOid = new ObjectId(user.id);
  const username = user.username;
  const messageId = new ObjectId();

  const messageToCreate = {
    _id: messageId,
    body: request["message-body"],
    userId: userOid,
    username: username,
  };

  const topicId = new ObjectId(request.topic_id);

  const response = await topicsCollection.updateOne(
    { _id: topicId },
    { $push: { messages: messageToCreate } },
  );

  await usersCollection.updateOne(
    { _id: userOid },
    { $push: { messages: { _id: messageId } } },
  );

  forumEmmitter.emit("newMessage", { senderId: userOid, topicId: topicId, bool: true });

  console.log(response);
  return messageToCreate;
}
