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

/***************** NOTE *****************/
/* this line is very important. it is what
loads the script needed by the 
HTML file (src="../scripts/script.js")*/
app.use(express.static("src"));
app.use(express.static("node_modules"));
/***************** NOTE *****************/

app.get("/user/create", function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "./src/views/user-create.html"),
    (err) => {
      errorCheck(err);
    },
  );
});
/*
Need to run submitUser() script inside user-login.html page and if the
validation returns false, create an element that says 
"Username or Password incorrect"
*/
app.post("/api/post/user", async function (req, res) {
  await submitUser(req.body);

  res.redirect("/user/login");
});

app.get("/user/login", function (req, res) {
  res.sendFile(
    path.join(import.meta.dirname, "./src/views/user-login.html"),
    (err) => {
      errorCheck(err);
    },
  );
});

app.post("/validate", async function (req, res) {
  const result = await validateUser(req.body);

  if (!result) {
    console.log("Username/password is incorrect");
    return res
      .status(400)
      .json({ validated: false, message: "Username/password is incorrect" });
  }

  console.log("Validated");
  res.json({ validated: true });
});
