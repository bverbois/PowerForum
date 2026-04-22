import { checkIfSubscribed } from "./createMessage.js";
import { navbar } from "./navbar.js";

const paths = window.location.pathname.split("/");
const id = paths[paths.length - 1];
const response = await fetch(`/api/topic/${id}`);
const subscriptions = await fetch("/api/get/subscriptions");

const data = await response.json();
const subscriptionData = await subscriptions.json();

checkIfSubscribed();

let subIds = [];
subscriptionData.body.topics.forEach((sub) => {
  subIds.push(sub._id);
});

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
  } else {
    console.log("something bad happened rip");
  }
  checkIfSubscribed();
});

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
  const content = document.createElement("p");
  content.textContent = "No messages yet...";
  messages.appendChild(content);
}

const navbarElement = document.getElementById("navbar");
navbarElement.innerHTML = await navbar();
