import { Database } from "../connections/database.js";
import { ObjectId } from "mongodb";

const collectionName = "topics";
const database = Database.getInstance();
const collection = database.collection(collectionName);

export async function submitTopic(topic) {
  const topicToCreate = {
    name: topic.name,
    description: topic.description,
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
