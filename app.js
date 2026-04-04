import express from "express";
import { errorCheck } from "./src/scripts/errorCheck.js";
import path from "path";
import { submitUser } from "./src/scripts/user.js";
import { validateUser } from "./src/scripts/user.js";

const app = express();
const port = 3000;
app.listen(port);
console.log("Server started at http://localhost:" + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post("/api/post/user", function (req, res) {
  submitUser(req.body);

  res.redirect("/user/login");
});

app.post("/validate", async function (req, res) {
  const result = await validateUser(req.body);
  if (result) {
    console.log("Validated");
    //res.redirect("../");
  } else {
    console.log("Username/password is incorrect");
  }
});
