import express from "express";
import { requireApiAuth } from "../middlewares/auth.js";
import {
  deleteTopic,
  getAllTopics,
  getTopic,
  getTopicsByCreator,
  submitTopic,
} from "../models/TopicModel.js";
import {
  addSubscription,
  removeSubscription,
  markUnreadFalse,
  getUserWithSubscriptions,
} from "../models/UserModel.js";

const router = express.Router();

router.post("/api/post/topic", requireApiAuth, async function (req, res) {
  if (!req.body.name || req.body.name.trim().length === 0) {
    return res.status(400).json({ body: "Name cannot be empty." });
  }

  const result = await submitTopic(req.body, req.session.user.id);
  const topicId = result.insertedId.toString();
  await addSubscription(req.session.user.id, topicId);

  return res.status(200).json({ body: result });
});

router.get("/api/topics", requireApiAuth, async function (req, res) {
  const response = await getAllTopics();

  return res.status(200).json({ body: response });
});

router.get("/api/topics/created", requireApiAuth, async function (req, res) {
  const result = await getTopicsByCreator(req.session.user.id);

  return res.status(200).json({ body: result });
});

router.get("/api/topic/:id", requireApiAuth, async function (req, res) {
  const id = req.params["id"];
  var response = await getTopic(id);
  const update = await markUnreadFalse(req.session.user.id, id);
  const user = await getUserWithSubscriptions(response.userId);
  response.username = user?.username ?? "[deleted user]";
  console.log(response);

  if (response === null) {
    return res.status(404).json({ body: "404 Topic not found :(" });
  }

  return res.status(200).json({ body: response });
});

router.delete(
  "/api/delete/topic/:id",
  requireApiAuth,
  async function (req, res) {
    const id = req.params["id"];
    const response = await deleteTopic(id);
    const responseRemoveSub = await removeSubscription(req.session.user.id, id);
    console.log(responseRemoveSub.modifiedCount);
    if (response.deleteCount === 0) {
      return res.status(404).json({ body: response });
    }

    return res.status(200).json({ body: response });
  },
);

export default router;
