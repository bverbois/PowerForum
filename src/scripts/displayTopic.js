import { renderMessageForm, getSubIds } from "./createMessage.js";
import { apiFetch } from "./apiFetch.js";
import { buildMessageElement, getCurrentUserId } from "./renderMessage.js";

const paths = window.location.pathname.split("/");
const id = paths[paths.length - 1];
const response = await apiFetch(`/api/topic/${id}`);
const data = await response.json();

renderMessageForm();
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
    await apiFetch(`/api/post/subscription/${id}`);
    subscription.className = "unsubscribe-topic-listing";
    subscription.name = "subscribed";
  } else if (subscription.name === "subscribed") {
    await apiFetch(`/api/delete/subscription/${id}`);
    subscription.className = "subscribe-topic-listing";
    subscription.name = "unsubscribed";
  }
});

const currentUserId = await getCurrentUserId();

if (data.body.messages?.length > 0) {
  data.body.messages.reverse().forEach((msg) => {
    messages.appendChild(buildMessageElement(msg, currentUserId));
  });
} else {
  const content = document.createElement("p");

  content.id = "no-messages";
  content.textContent = "No messages yet...";

  messages.appendChild(content);
}

const targetMessageId = new URLSearchParams(window.location.search).get(
  "message",
);
if (targetMessageId) {
  const target = document.getElementById(targetMessageId);
  if (target) {
    target.scrollIntoView({ block: "center" });
    const highlighted = target.parentElement ?? target;
    highlighted.classList.add("message-highlight");
  }
}
