import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { currentSessionDbName } from "./sessionContext.js";

dotenv.config();
const uri = process.env.MONGO_URI;

export class Database {
  static instance;

  constructor() {
    if (Database.instance) {
      throw new Error("You must use Database.getInstance()");
    }
    this.client = new MongoClient(uri);
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
    return !!Database.instance;
  }

  // Establish the connection pool. Called once during startup, before the
  // server accepts requests. Models capture their collections at import time,
  // but the proxy below defers every actual operation until call time, so no
  // DB work happens before this runs.
  async start() {
    await this.client.connect();
    console.log("Connected to MongoDB (demo mode: per-session databases)...");
  }

  // Raw database handle, bypassing per-session routing. Used only for seeding
  // and cleanup, which operate on a database explicitly by name.
  rawDb(name) {
    return this.client.db(name);
  }

  async listDbNames() {
    const result = await this.client
      .db()
      .admin()
      .listDatabases({ nameOnly: true });
    return result.databases.map((d) => d.name);
  }

  // Returns a lazy proxy that resolves the CURRENT session's database on every
  // method access. This lets the models capture a collection once at import
  // time yet still route each operation to the right per-session database via
  // AsyncLocalStorage. Cursor-returning methods (find/aggregate) work because
  // the real driver object is what gets returned and chained.
  collection(collectionName) {
    const self = this;
    return new Proxy(
      {},
      {
        get(_target, prop) {
          const real = self.client
            .db(currentSessionDbName())
            .collection(collectionName);
          const value = real[prop];
          return typeof value === "function" ? value.bind(real) : value;
        },
      },
    );
  }

  async closeConnection() {
    await this.client.close();
    console.log("Client connection closed...");
  }
}
