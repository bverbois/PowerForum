import { Database } from "../connections/database.js";
import { MongoClient, ObjectId } from "mongodb";

const collectionName = "topics";

export async function submitTopic(topic) {
  const topicToCreate = {
    name: topic.name,
    description: topic.description,
  };

  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const response = await collection.insertOne(topicToCreate);
  console.log(response);
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

export async function getTopic(topicId) {
  const oid = new ObjectId(topicId);

  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const response = await collection.findOne({ _id: oid });
  console.log(response);

  return response;
}
