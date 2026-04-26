import express from "express";
import { errorCheck } from "./src/scripts/errorCheck.js";
import path from "path";
import {
  getUsersByMessages,
  submitUser,
  authenticateUser,
  removeSubscription,
  addSubscription,
  getUserWithSubscriptions,
  getSubscriptions,
  markUnreadFalse,
} from "./controllers/UsersController.js";
import {
  getAllTopics,
  getTopic,
  getTopicsWithLatest,
  submitTopic,
} from "./controllers/TopicsController.js";
import { Database } from "./connections/database.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import { submitMessage } from "./controllers/MessagesController.js";
import "./services/notificationService.js";

dotenv.config();
const app = express();
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000,
    },
  }),
);

app.use(express.static("src"));
app.use(express.static("node_modules"));

function checkCookie(req, res) {
  const cookies = req.cookies;
  if (!cookies["auth"] || !req.session.user) {
    res.redirect("/user/login");
    return false;
  }
  return true;
}

const database = Database.getInstance();
//Close the db connection on program exit
process.on("SIGINT", async function () {
  await database.closeConnection();

  server.close(() => {
    console.log("Server closed...");
  });
});

//This could be a landing page eventually
app.get("/", function (req, res) {
  if (checkCookie(req, res)) {
    res.redirect("/user");
  }
});

app.post("/api/authenticate", async function (req, res) {
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

  res.cookie("auth", "true", { maxAge: 30 * 60 * 1000 }); //30minutes expiration

  req.session.user = {
    id: result._id.toString(),
    name: result.name,
    username: result.username,
  };

  res.json({ authenticated: true });
});

app.post("/api/post/user", async function (req, res) {
  try {
    var result = await submitUser(req.body);
  } catch (error) {
    return res.status(400).json({ body: error });
  }

  return res.status(200).json({ body: result });
});

app.get("/api/get/user", async function (req, res) {
  const result = await getUserWithSubscriptions(req.session.user.id);
  const topics = await getTopicsWithLatest(result.topics);
  result.topics = topics;

  return res.status(200).json({ body: result });
});

app.get("/api/delete/subscription/:id", async function (req, res) {
  if (checkCookie(req, res)) {
    const response = await removeSubscription(
      req.session.user.id,
      req.params["id"],
    );
    return res.status(200).json({ body: response });
  }
});

app.get("/api/post/subscription/:id", async function (req, res) {
  if (checkCookie(req, res)) {
    const response = await addSubscription(
      req.session.user.id,
      req.params["id"],
    );
    return res.status(200).json({ body: response });
  }
});

app.get("/api/get/subscriptions", async function (req, res) {
  if (checkCookie(req, res)) {
    const response = await getSubscriptions(req.session.user.id);

    return res.status(200).json({ body: response });
  }
});

app.get("/user/create", function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "./src/views/user-create.html"),
    (err) => {
      errorCheck(err);
    },
  );
});

app.get("/user/login", function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "./src/views/user-login.html"),
    (err) => {
      errorCheck(err);
    },
  );
});

app.get("/user/logout", function (req, res) {
  if (checkCookie) {
    res.clearCookie("auth");
    res.clearCookie("connect.sid");
  }
  res.redirect("/");
});

app.get("/user", function (req, res) {
  if (checkCookie(req, res)) {
    res.sendFile(
      path.join(import.meta.dirname, "./src/views/user-display.html"),
      (err) => {
        errorCheck(err);
      },
    );
  }
});

app.post("/api/post/topic", async function (req, res) {
  if (checkCookie(req, res)) {
    if (!req.body.name || req.body.name.trim().length === 0) {
      return res.status(400).json({ body: "Name cannot be empty." });
    }

    const result = await submitTopic(req.body);
    const topicId = result.insertedId.toString();
    await addSubscription(req.session.user.id, topicId);

    return res.status(200).json({ body: result });
  }
});

app.get("/api/topics", async function (req, res) {
  if (checkCookie(req, res)) {
    const response = await getAllTopics();

    return res.status(200).json({ body: response });
  }
});

app.get("/api/topic/:id", async function (req, res) {
  if (checkCookie(req, res)) {
    const id = req.params["id"];
    const response = await getTopic(id);
    const update = await markUnreadFalse(req.session.user.id, id);

    if (response === null) {
      return res.status(404).json({ body: "404 Topic not found :(" });
    }

    return res.status(200).json({ body: response });
  }
});

app.get("/topic/create", function (req, res) {
  if (checkCookie(req, res)) {
    res.sendFile(
      path.join(import.meta.dirname, "./src/views/topic-create.html"),
      (err) => {
        errorCheck(err);
      },
    );
  }
});

app.get("/topics", function (req, res) {
  if (checkCookie(req, res)) {
    res.sendFile(
      path.join(import.meta.dirname, "./src/views/topics-display.html"),
      (err) => {
        errorCheck(err);
      },
    );
  }
});

app.get("/topic/:id", function (req, res) {
  if (checkCookie(req, res)) {
    res.sendFile(
      path.join(import.meta.dirname, "./src/views/topic-display.html"),
      (err) => {
        errorCheck(err);
      },
    );
  }
});

app.get("/topics/statistics", function (req, res) {
  if (checkCookie(req, res)) {
    res.sendFile(
      path.join(import.meta.dirname, "./src/views/topics-access-counts.html"),
      (err) => {
        errorCheck(err);
      },
    );
  }
});

app.post("/api/post/message", async function (req, res) {
  if (checkCookie(req, res)) {
    const response = await submitMessage(req.body, req.session.user);
    return res.status(201).json({ body: response });
  }
});
