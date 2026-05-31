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

  const topicOid = new ObjectId(request.topic_id);

  const response = await topicsCollection.updateOne(
    { _id: topicOid },
    { $push: { messages: messageToCreate } },
  );

  await usersCollection.updateOne(
    { _id: userOid },
    { $push: { messages: { _id: messageId } } },
  );

  forumEmmitter.emit("newMessage", {
    senderId: userOid,
    topicId: topicOid,
    bool: true,
  });

  return messageToCreate;
}

export async function deleteMessage(id, userId) {
  const oid = new ObjectId(id);
  const userOid = new ObjectId(userId);

  const response = await topicsCollection.updateMany(
    {},
    { $pull: { messages: { _id: oid, userId: userOid } } },
  );
  return response;
}

export async function updateMessage(id, userId, newBody) {
  const oid = new ObjectId(id);
  const userOid = new ObjectId(userId);

  const response = await topicsCollection.updateOne(
    { "messages._id": oid, "messages.userId": userOid },
    { $set: { "messages.$.body": newBody } },
  );
  return response;
}

export async function deleteMessagesByUserId(id) {
  const response = await topicsCollection.updateMany(
    {},
    { $pull: { messages: { userId: new ObjectId(id) } } },
  );

  return response;
}
