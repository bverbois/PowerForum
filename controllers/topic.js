import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;
const collectionName = "topics";

export async function submitTopic(topic) {
  const topicToCreate = {
    name: topic.name,
    description: topic.description,
  };

  const client = new MongoClient(uri);
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const response = await collection.insertOne(topicToCreate);
    console.log(response);
  } finally {
    await client.close();
  }
}
