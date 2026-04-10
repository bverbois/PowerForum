const paths = window.location.pathname.split("/");
const id = paths[paths.length - 1];
const response = await fetch(`/api/topic/${id}`);
const data = await response.json();
console.log(data);

const title = document.getElementById("title");
const description = document.getElementById("description");
const messages = document.getElementById("messages");

title.textContent = `Title: ${data.body.name}`;
description.textContent = `Description: ${data.body.description}`;

if (data.body.messages?.length > 0) {
  data.body.messages.forEach((msg) => {
    const container = document.createElement("div");
    const content = document.createElement("p");
    content.id = msg._id;
    const username = document.createElement("p");
    username.id = msg.userId;
    username.textContent = msg.username;
    content.textContent = msg.body;
    container.appendChild(username);
    container.appendChild(content);
    messages.appendChild(container);
  });
} else {
  content.textContent = "No messages yet...";
  messages.appendChild(content);
}
