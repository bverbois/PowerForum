import { updateUnreadStatus } from "../controllers/UsersController.js";
import { forumEmmitter } from "../events.js";

forumEmmitter.on("newMessage", async ({ senderId, topicId }) => {
  updateUnreadStatus(senderId, topicId);
});

// import { Database } from "../connections/database.js";
// import { MongoClient, ObjectId } from "mongodb";

// export class Notifier {
//   constructor(topicId) {
//     this.database = Database.getInstance();
//     this.topicId = topicId;
//     this.users = [];
//   }

//   notify() {
//     //This is gonna send a notification to every
//     //user in the list of users
//   }

//   addUser(userId) {
//     //this adds a user to the list of users
//   }

//   removeUser(userId) {
//     //this removes a user from the list of users
//   }
// }

// async function topicListener() {
//   const collectionName = "topics";

//   const database = Database.getInstance();
//   const collection = database.collection(collectionName);

//   const changeStream = await collection.watch();

//   changeStream.on("change", () => {
//     console.log("message was changed");
//   });
// }

// topicListener();
