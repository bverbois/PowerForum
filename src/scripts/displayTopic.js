import { checkIfSubscribed, getSubIds } from "./createMessage.js";

const paths = window.location.pathname.split("/");
const id = paths[paths.length - 1];
const response = await fetch(`/api/topic/${id}`);
const data = await response.json();

checkIfSubscribed();
let subIds = await getSubIds();

const header = document.getElementById("header");
const buttonContainer = document.getElementById("button-container");
const description = document.getElementById("description");
const messages = document.getElementById("messages");
const username = document.getElementById("username");
const title = document.createElement("h1");
const subscription = document.createElement("button");

header.className = "header";
title.className = "topic-listing-title";
title.textContent = `${data.body.name}`;
description.textContent = `${data.body.description}`;

if (data.body.username) {
  username.textContent = `created by ${data.body.username}`;
}
if (subIds.includes(id)) {
  subscription.name = "subscribed";
  subscription.className = "unsubscribe-topic-listing";
} else {
  subscription.name = "unsubscribed";
  subscription.className = "subscribe-topic-listing";
}

buttonContainer.appendChild(subscription);
header.appendChild(buttonContainer);
header.appendChild(title);

subscription.addEventListener("click", async (event) => {
  if (subscription.name === "unsubscribed") {
    await fetch(`/api/post/subscription/${id}`);
    subscription.className = "unsubscribe-topic-listing";
    subscription.name = "subscribed";
  } else if (subscription.name === "subscribed") {
    await fetch(`/api/delete/subscription/${id}`);
    subscription.className = "subscribe-topic-listing";
    subscription.name = "unsubscribed";
  }
  checkIfSubscribed();
});

if (data.body.messages?.length > 0) {
  data.body.messages.reverse().forEach((msg) => {
    const container = document.createElement("div");
    const content = document.createElement("p");
    const username = document.createElement("p");

    container.className = "message-container";
    content.id = msg._id;
    content.textContent = msg.body;
    username.id = msg.userId;
    username.textContent = msg.username;
    username.className = "message-username";

    container.appendChild(username);
    container.appendChild(content);
    messages.appendChild(container);
  });
} else {
  const content = document.createElement("p");

  content.id = "no-messages";
  content.textContent = "No messages yet...";

  messages.appendChild(content);
}
