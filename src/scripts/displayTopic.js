import { renderMessageForm } from "./createMessage.js";
import { apiFetch } from "./apiFetch.js";
import { getSubscribedIds, bindSubscriptionToggle } from "./subscriptions.js";
import { buildMessageElement, getCurrentUserId } from "./renderMessage.js";

const paths = window.location.pathname.split("/");
const id = paths[paths.length - 1];
const response = await apiFetch(`/api/topic/${id}`);
const data = await response.json();

renderMessageForm();
const subIds = await getSubscribedIds();

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
buttonContainer.appendChild(subscription);
header.appendChild(buttonContainer);
header.appendChild(title);

bindSubscriptionToggle(subscription, id, {
  subscribedClass: "unsubscribe-topic-listing",
  unsubscribedClass: "subscribe-topic-listing",
  isSubscribed: subIds.includes(id),
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
