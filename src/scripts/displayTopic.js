import { navbar } from "./navbar.js";

const paths = window.location.pathname.split("/");
const id = paths[paths.length - 1];
const response = await fetch(`/api/topic/${id}`);
const data = await response.json();

const header = document.getElementById("header");
const title = document.createElement("h1");
const subscribeButton = document.createElement("button");

const description = document.getElementById("description");
const messages = document.getElementById("messages");

header.className = "header";
title.textContent = `${data.body.name}`;
subscribeButton.textContent = "Subscribe";
description.textContent = `${data.body.description}`;

header.appendChild(title);
header.appendChild(subscribeButton);

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
