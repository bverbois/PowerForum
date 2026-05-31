import express from "express";
import { requireApiAuth } from "../middlewares/auth.js";
import {
  deleteMessage,
  submitMessage,
  updateMessage,
} from "../models/MessageModel.js";
import { removeMessage, getSubscriptions } from "../models/UserModel.js";
import { getRecentMessagesForSubscriptions } from "../models/TopicModel.js";

const router = express.Router();

router.get("/api/messages/recent", requireApiAuth, async function (req, res) {
  const subscriptions = await getSubscriptions(req.session.user.id);
  const topicIds = (subscriptions?.topics ?? []).map((topic) => topic._id);

  if (topicIds.length === 0) {
    return res.status(200).json({ body: [] });
  }

  const response = await getRecentMessagesForSubscriptions(
    topicIds,
    req.session.user.id,
  );
  return res.status(200).json({ body: response });
});

router.post("/api/post/message", requireApiAuth, async function (req, res) {
  const response = await submitMessage(req.body, req.session.user);
  return res.status(201).json({ body: response });
});

router.post("/api/edit/message/:id", requireApiAuth, async function (req, res) {
  const id = req.params["id"];
  const newBody = (req.body.body ?? "").trim();

  if (newBody.length === 0) {
    return res.status(400).json({ body: "Message cannot be empty." });
  }

  const response = await updateMessage(id, req.session.user.id, newBody);

  if (response.matchedCount === 0) {
    return res.status(404).json({ body: "Message not found." });
  }

  return res.status(200).json({ body: { _id: id, body: newBody } });
});

router.get("/api/delete/message/:id", requireApiAuth, async function (req, res) {
  const id = req.params["id"];

  const response = await deleteMessage(id, req.session.user.id);

  if (response.modifiedCount === 0) {
    return res.status(404).json({ body: response });
  }

  const removeMessageResponse = await removeMessage(id);
  return res.status(200).json({ body: { response, removeMessageResponse } });
});

export default router;
