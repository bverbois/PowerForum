import { Database } from "../connections/database.js";

const collectionName = "users";

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

  console.log(response);
  return response;
}
