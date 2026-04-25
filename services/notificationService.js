import { updateUnreadStatus } from "../controllers/UsersController.js";
import { forumEmmitter } from "../events.js";

forumEmmitter.on("newMessage", async ({ senderId, topicId, bool }) => {
  updateUnreadStatus(senderId, topicId, bool);
});
