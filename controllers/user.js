import { Database } from "../connections/database.js";

const collectionName = "users";
// const noPassword = { projection: { password: 0 } };

export async function submitUser(user) {
  const userToCreate = {
    name: user.name,
    username: user.username,
    password: user.password,
  };

  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const response = await collection.insertOne(userToCreate);
  console.log(response);
  database.closeConnection();
}

export async function validateUser(user) {
  const userToValidate = {
    username: user.username,
    password: user.password,
  };

  const database = Database.getInstance();
  const collection = database.collection(collectionName);
  const response = await collection.countDocuments(userToValidate, {
    projection: { limit: 1 },
  });

  const found = response > 0;
  console.log(response);
  console.log(found);
  return found;
}
