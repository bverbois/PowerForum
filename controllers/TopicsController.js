import { Database } from "../connections/database.js";
import { ObjectId } from "mongodb";

const collectionName = "topics";
const database = Database.getInstance();
const collection = database.collection(collectionName);

export async function submitTopic(topic, userId) {
  const userOid = new ObjectId(userId);

  const topicToCreate = {
    name: topic.name,
    description: topic.description,
    userId: userOid,
    messages: [],
    topics: [],
    accessCounter: 0,
  };

  const response = await collection.insertOne(topicToCreate);
  return response;
}

export async function getAllTopics() {
  let response = await collection.find({}).toArray();

  let topicIds = [];
  response.forEach((topic) => {
    topicIds.push(topic._id);
  });

  collection.updateMany(
    { _id: { $in: topicIds } },
    { $inc: { accessCounter: 1 } },
  );

  return response;
}

export async function getTopicsWithLatest(topics) {
  let topicIds = [];

  topics.forEach((topic) => {
    topicIds.push(topic._id);
  });

  const response = await collection
    .find({ _id: { $in: topicIds } })
    .project({
      name: 1,
      description: 1,
      latestTwo: { $slice: ["$messages", -2] },
    })
    .toArray();

  collection.updateMany(
    { _id: { $in: topicIds } },
    { $inc: { accessCounter: 1 } },
  );

  return response;
}

export async function getTopic(topicId) {
  const oid = new ObjectId(topicId);

  const response = await collection.findOne({ _id: oid });

  collection.updateOne({ _id: oid }, { $inc: { accessCounter: 1 } });

  return response;
}

export async function deleteTopic(id) {
  const response = await collection.deleteOne({ _id: new ObjectId(id) });

  return response;
}
