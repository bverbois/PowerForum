import { Database } from "../connections/database.js";

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
