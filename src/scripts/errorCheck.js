export function errorCheck(err) {
  if (err) {
    return res.send("Error has occured: ", err);
  } else {
    console.log("Success!");
  }
}
