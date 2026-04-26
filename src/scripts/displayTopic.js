import { checkIfSubscribed, getSubIds } from "./createMessage.js";

const paths = window.location.pathname.split("/");
const id = paths[paths.length - 1];
const response = await fetch(`/api/topic/${id}`);

const data = await response.json();

checkIfSubscribed();

let subIds = await getSubIds();

const header = document.getElementById("header");
const title = document.createElement("h1");
const buttonContainer = document.getElementById("button-container");
const subscription = document.createElement("button");

if (subIds.includes(id)) {
  subscription.name = "subscribed";
  subscription.className = "unsubscribe-topic-listing";
} else {
  subscription.name = "unsubscribed";
  subscription.className = "subscribe-topic-listing";
}

const description = document.getElementById("description");
const messages = document.getElementById("messages");

header.className = "header";
title.textContent = `${data.body.name}`;
description.textContent = `${data.body.description}`;

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
    content.id = msg._id;
    const username = document.createElement("p");
    username.id = msg.userId;
    username.textContent = msg.username;
    username.className = "message-username";
    content.textContent = msg.body;
    container.className = "message-container";
    container.appendChild(username);
    container.appendChild(content);
    messages.appendChild(container);
  });
} else {
  const content = document.createElement("p");
  content.textContent = "No messages yet...";
  content.id = "no-messages";
  messages.appendChild(content);
}
