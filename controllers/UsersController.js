import express from "express";
import { requireApiAuth } from "../middlewares/auth.js";
import {
  submitUser,
  authenticateUser,
  removeSubscription,
  addSubscription,
  getUserWithSubscriptions,
  getSubscriptions,
  deleteUser,
} from "../models/UserModel.js";
import { getTopicsWithLatest } from "../models/TopicModel.js";
import { deleteMessagesByUserId } from "../models/MessageModel.js";

const router = express.Router();

router.post("/api/authenticate", async function (req, res) {
  if (
    !req.body.username ||
    req.body.username.trim().length === 0 ||
    !req.body.password ||
    req.body.password.trim().length === 0
  ) {
    return res.status(400).json({
      authenticated: false,
      message: "Username/password cannot be empty.",
    });
  }

  const result = await authenticateUser(req.body);

  if (!result) {
    return res.status(400).json({
      authenticated: false,
      message: "Username/password is incorrect.",
    });
  }

  req.session.user = {
    id: result._id.toString(),
    name: result.name,
    username: result.username,
  };

  res.json({ authenticated: true });
});

router.post("/api/post/user", async function (req, res) {
  try {
    var result = await submitUser(req.body);
  } catch (error) {
    return res.status(400).json({ body: error });
  }

  return res.status(200).json({ body: result });
});

router.get("/api/get/user", requireApiAuth, async function (req, res) {
  const result = await getUserWithSubscriptions(req.session.user.id);
  const topics = await getTopicsWithLatest(result.topics);
  result.topics = topics;

  return res.status(200).json({ body: result });
});

router.get("/api/user/:id", requireApiAuth, async function (req, res) {
  // NOTE: getUserById is not defined/imported anywhere — pre-existing bug
  // carried over verbatim from app.js. This route throws if ever hit.
  const result = await getUserById(req.params["id"]);

  return res.status(200).json({ body: result });
});

router.get("/api/delete/user", requireApiAuth, async function (req, res) {
  const result = await deleteUser(req.session.user.id);
  const removeMessageResult = await deleteMessagesByUserId(req.session.user.id);
  console.log(removeMessageResult);
  if (result.deletedCount === 0) {
    return res.status(400).json({ body: result });
  }
  res.clearCookie("connect.sid");
  return res.status(200).json({ body: { result, removeMessageResult } });
});

router.get(
  "/api/delete/subscription/:id",
  requireApiAuth,
  async function (req, res) {
    const response = await removeSubscription(
      req.session.user.id,
      req.params["id"],
    );
    return res.status(200).json({ body: response });
  },
);

router.get(
  "/api/post/subscription/:id",
  requireApiAuth,
  async function (req, res) {
    const response = await addSubscription(
      req.session.user.id,
      req.params["id"],
    );
    return res.status(200).json({ body: response });
  },
);

router.get("/api/get/subscriptions", requireApiAuth, async function (req, res) {
  const response = await getSubscriptions(req.session.user.id);

  return res.status(200).json({ body: response });
});

export default router;
