import express from "express";
import { requireApiAuth } from "../middlewares/auth.js";
import { deleteMessage, submitMessage } from "../models/MessageModel.js";
import { removeMessage } from "../models/UserModel.js";

const router = express.Router();

router.post("/api/post/message", requireApiAuth, async function (req, res) {
  const response = await submitMessage(req.body, req.session.user);
  return res.status(201).json({ body: response });
});

router.get("/api/delete/message/:id", requireApiAuth, async function (req, res) {
  const id = req.params["id"];

  const response = await deleteMessage(id);
  const removeMessageResponse = await removeMessage(id);

  if (response.modifiedCount === 0 || removeMessageResponse.modifiedCount == 0) {
    return res.status(404).json({ body: { response, removeMessageResponse } });
  }

  return res.status(200).json({ body: { response, removeMessageResponse } });
});

export default router;
