import express from "express";
import { errorCheck } from "./src/scripts/errorCheck.js";
import path from "path";
import { Database } from "./connections/database.js";
import session from "express-session";
import dotenv from "dotenv";
import { requirePageAuth } from "./middlewares/auth.js";
import usersController from "./controllers/UsersController.js";
import topicsController from "./controllers/TopicsController.js";
import messagesController from "./controllers/MessagesController.js";
import "./services/notificationService.js";

dotenv.config();
const app = express();
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src"));
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

// API routes live in their respective controllers (MVC).
app.use(usersController);
app.use(topicsController);
app.use(messagesController);

app.get("/user/logout", function (req, res) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

//////////////////////////////////////////////////////////////////////////////////

app.get("/", requirePageAuth, function (req, res) {
  res.sendFile(path.join(import.meta.dirname, "./src/views/home.html"), (err) => {
    errorCheck(err);
  });
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

app.get("/user", requirePageAuth, function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "./src/views/user-display.html"),
    (err) => {
      errorCheck(err);
    },
  );
});

app.get("/topic/create", requirePageAuth, function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "./src/views/topic-create.html"),
    (err) => {
      errorCheck(err);
    },
  );
});

app.get("/topics", requirePageAuth, function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "./src/views/topics-display.html"),
    (err) => {
      errorCheck(err);
    },
  );
});

app.get("/topic/:id", requirePageAuth, function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "./src/views/topic-display.html"),
    (err) => {
      errorCheck(err);
    },
  );
});

app.get("/topics/statistics", requirePageAuth, function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "./src/views/topics-access-counts.html"),
    (err) => {
      errorCheck(err);
    },
  );
});

const database = Database.getInstance();
//Close the db connection on program exit
process.on("SIGINT", async function () {
  await database.closeConnection();

  server.close(() => {
    console.log("Server closed...");
  });
});
