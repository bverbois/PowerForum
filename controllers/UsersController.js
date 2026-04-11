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
  console.log(response);
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

  getTopicsWithLatest(response.topics);

  //console.log(topics);
  return response;
}

export async function getUserWithFavorites(id) {
  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const oid = new ObjectId(id);
  const response = await collection.findOne(
    { _id: oid },
    {
      projection: { password: 0 },
    },
  );

  getTopicsWithLatest(topics);

  //console.log(topics);
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
  // .project({
  //   messages: { $elemMatch: { _id: { $in: messageIds } } },
  //   username: 1,
  // });
  for await (let user of results) {
    users.push(user);
  }

  return users;
}
