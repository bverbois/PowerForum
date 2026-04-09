const paths = window.location.pathname.split("/");
const id = paths[paths.length - 1];
const response = await fetch(`/api/topic/${id}`);
const data = await response.json();
console.log(data);

const container = document.getElementById("body1");

const title = document.getElementById("title");
const description = document.getElementById("description");
const messages = document.getElementById("messages");

title.textContent = `Title: ${data.body.name}`;
description.textContent = `Description: ${data.body.description}`;

if (data.body.messages?.length > 0) {
  data.body.messages.forEach((msg) => {
    const content = document.createElement("p");
    content.textContent = msg.body;
    messages.appendChild(content);
  });
} else {
  content.textContent = "No messages yet...";
  messages.appendChild(content);
}
