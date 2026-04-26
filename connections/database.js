import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGO_URI;

export class Database {
  static instance;

  constructor() {
    if (Database.instance) {
      throw new Error("You must use Database.getInstance()");
    }
    this.client = new MongoClient(uri);
    this.connection = this.connect();
    Database.instance = this;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
      console.log("New Database instance created...");
    }
    return Database.instance;
  }

  static hasInstance() {
    if (Database.instance) {
      return true;
    } else {
      return false;
    }
  }

  connect() {
    const client = this.client;

    const dbName = process.env.MONGO_DB;
    const database = client.db(dbName);

    console.log("Connected to database...");
    return database;
  }

  collection(collectionName) {
    const collection = this.connection.collection(collectionName);

    return collection;
  }

  closeConnection() {
    const client = this.client;
    client.close();
    console.log("Client connection closed...");
  }
}
