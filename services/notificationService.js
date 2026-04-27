import { updateUnreadStatus } from "../models/UserModel.js";
import EventEmitter from "events";

export const forumEmmitter = new EventEmitter();

forumEmmitter.on("newMessage", async ({ senderId, topicId, bool }) => {
  updateUnreadStatus(senderId, topicId, bool);
});
