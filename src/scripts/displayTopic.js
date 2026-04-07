console.log("it works");
const paths = window.location.pathname.split("/");
const id = paths[paths.length - 1];
const response = await fetch(`/api/topic/${id}`);
const data = await response.json();
console.log(data);

const container = document.getElementById("body1");

const title = document.getElementById("title");
const description = document.getElementById("description");
const messages = document.getElementById("messages");
const content = document.createElement("p");

title.textContent = `Title: ${data.body.name}`;
description.textContent = `Description: ${data.body.description}`;
container.appendChild(title);
container.appendChild(description);

if (data.body.messages?.length > 0) {
  data.body.messages.forEach((msg) => {
    content.textContent = msg.body;
    container.appendChild(content);
  });
} else {
  content.textContent = "No messages yet...";
  container.appendChild(content);
}
