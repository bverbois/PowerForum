import { ObjectId } from "mongodb";
import { Database } from "../connections/database.js";
import { getTopicsWithLatest } from "./TopicsController.js";

const collectionName = "users";

export async function submitUser(user) {
  const userToCreate = {
    name: user.name,
    username: user.username,
    password: user.password,
    messages: [],
    topics: [],
  };

  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const response = await collection.insertOne(userToCreate);
}

export async function authenticateUser(user) {
  const userToValidate = {
    username: user.username,
    password: user.password,
  };

  const database = Database.getInstance();
  const collection = database.collection(collectionName);

  const response = await collection.findOne(userToValidate, {
    projection: { password: 0 },
  });

  return response;
}

export async function getUserWithSubscriptions(id) {
  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const oid = new ObjectId(id);
  const response = await collection.findOne(
    { _id: oid },
    {
      projection: { password: 0, messages: 0 },
    },
  );

  return response;
}

export async function getSubscriptions(id) {
  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const oid = new ObjectId(id);
  const response = await collection.findOne(
    { _id: oid },
    {
      projection: { password: 0, messages: 0, _id: 0, name: 0, username: 0 },
    },
  );

  return response;
}

export async function getUsersByMessages(messages) {
  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  var messageIds = [];
  var users = [];

  messages.forEach((msg) => {
    messageIds.push(msg._id);
  });

  const results = await collection
    .find({ "messages._id": { $in: messageIds } })
    .project({
      username: 1,
    });

  for await (let user of results) {
    users.push(user);
  }

  return users;
}

export async function removeSubscription(userId, topicId) {
  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const userOid = new ObjectId(userId);
  const topicOid = new ObjectId(topicId);
  const result = await collection.updateOne(
    { _id: userOid },
    { $pull: { topics: { _id: topicOid } } },
  );
}

export async function addSubscription(userId, topicId) {
  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const userOid = new ObjectId(userId);
  const topicOid = new ObjectId(topicId);
  const result = await collection.updateOne(
    { _id: userOid },
    { $push: { topics: { _id: topicOid } } },
  );
}
