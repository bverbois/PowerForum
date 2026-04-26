import { Database } from "../connections/database.js";
import { ObjectId } from "mongodb";
import { forumEmmitter } from "../services/notificationService.js";

const collectionName = "topics";
const database = Database.getInstance();
const topicsCollection = database.collection(collectionName);
const usersCollection = database.collection("users");

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

  forumEmmitter.emit("newMessage", {
    senderId: userOid,
    topicId: topicId,
    bool: true,
  });

  console.log(response);
  return messageToCreate;
}
