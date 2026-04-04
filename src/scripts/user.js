import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;
const collectionName = "users";
const noPassword = { projection: { password: 0 } };

export async function submitUser(user) {
  const userToCreate = {
    name: user.name,
    username: user.username,
    password: user.password,
  };
  const client = new MongoClient(uri);
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const response = await collection.insertOne(userToCreate);
    console.log(response);
  } finally {
    await client.close();
  }
}

export async function validateUser(user) {
  const userToValidate = {
    username: user.username,
    password: user.password,
  };
  const client = new MongoClient(uri);
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const response = await collection.countDocuments(userToValidate, {
      projection: { limit: 1 },
    });
    const found = response > 0;
    console.log(response);
    console.log(found);
    return found;
  } finally {
    await client.close();
  }
}

// Now work on DOM stuff to add an element that says
// Username or Password incorrect then focus on database
// singleton
