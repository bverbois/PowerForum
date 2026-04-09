import express from "express";
import { errorCheck } from "./src/scripts/errorCheck.js";
import path from "path";
import { submitUser } from "./controllers/UsersController.js";
import { authenticateUser } from "./controllers/UsersController.js";
import {
  getAllTopics,
  getTopic,
  submitTopic,
} from "./controllers/TopicsController.js";
import { Database } from "./connections/database.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import { submitMessage } from "./controllers/MessagesController.js";

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

/***************** NOTE *****************/
/* this line is very important. it is what
loads the script needed by the 
HTML file (src="../scripts/script.js")*/
app.use(express.static("src"));
app.use(express.static("node_modules"));
/***************** NOTE *****************/

function checkCookie(req, res) {
  //Checks for authentication cookie
  const cookies = req.cookies;
  if (!cookies["auth"] || !req.session.user) {
    console.log(cookies["auth"]);
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
    res.redirect("/topics");
  }
});

app.post("/api/post/user", async function (req, res) {
  await submitUser(req.body);

  res.redirect("/user/login");
});

app.post("/api/authenticate", async function (req, res) {
  const result = await authenticateUser(req.body);

  if (!result) {
    console.log("Username/password is incorrect");
    return res.status(400).json({
      authenticated: false,
      message: "Username/password is incorrect",
    });
  }

  res.cookie("auth", "true", { maxAge: 30 * 60 * 1000 }); //30minutes expiration

  req.session.user = {
    id: result._id.toString(),
    name: result.name,
    username: result.username,
  };

  console.log("Authenticated");
  res.json({ authenticated: true });
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

app.post("/api/post/topic", async function (req, res) {
  if (checkCookie(req, res)) {
    await submitTopic(req.body);

    res.redirect("/topics");
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
  console.log(req.session.user);
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
  console.log(req.session.user);
});

app.get("/api/topics", async function (req, res) {
  if (checkCookie(req, res)) {
    const response = await getAllTopics();

    return res.status(200).json({ body: response });
  }
});

app.get("/api/topic/:id", async function (req, res) {
  if (checkCookie(req, res)) {
    const response = await getTopic(req.params["id"]);

    if (response === null) {
      console.log("404 Topic not found :(");
      return res.status(404).json({ body: "404 Topic not found :(" });
    }

    return res.status(200).json({ body: response });
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

app.post("/api/post/message", async function (req, res) {
  if (checkCookie(req, res)) {
    const response = await submitMessage(req.body, req.session.user.id);
    console.log(response);
    return res.status(201).json({ body: response });
  }
});
