import { Database } from "../connections/database.js";
import { MongoClient, ObjectId } from "mongodb";

const collectionName = "topics";

export async function submitTopic(topic) {
  const topicToCreate = {
    name: topic.name,
    description: topic.description,
    messages: [],
  };

  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const response = await collection.insertOne(topicToCreate);
  return response;
}

export async function getAllTopics() {
  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  let response = await collection.find({}).toArray();

  // response.forEach((r) => {
  //   console.log(`Name: ${r.name} \nDescription: ${r.description}`);
  // });

  return response;
}

export async function getTopicsWithLatest(topics) {
  const database = Database.getInstance();
  const collection = database.collection(collectionName);

  let topicIds = [];

  topics.forEach((topic) => {
    topicIds.push(topic._id);
    console.log(topic._id);
  });

  const response = await database
    .collection("topics")
    .find({ _id: { $in: topicIds } })
    .project({
      name: 1,
      description: 1,
      latestTwo: { $slice: ["$messages", -2] },
    })
    .toArray();

  // response.forEach((topic) => {
  //   console.log(topic);
  // });

  return response;
}

export async function getTopic(topicId) {
  const oid = new ObjectId(topicId);

  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const response = await collection.findOne({ _id: oid });
  console.log(response);

  return response;
}
