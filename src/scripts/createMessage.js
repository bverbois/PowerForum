import { apiFetch } from "./apiFetch.js";

const paths = window.location.pathname.split("/");
const topicId = paths[paths.length - 1];
const messageSubmit = document.getElementById("message-submit");

async function notSubscribed() {
  await fetch("../views/topic-display-form.html")
    .then((response) => response.text())
    .then((data) => {
      if (document.getElementById("message-submit-container")) {
        const temp = document.getElementById("message-submit-container");
        messageSubmit.removeChild(temp);
      }

      const container = document.createElement("div");
      const messageBody = document.getElementById("message-body");
      const submitButton = document.getElementById("message-submit-btn");

      container.id = "message-submit-container";
      container.innerHTML = data;
      messageBody.className = "block-message";
      messageBody.placeholder = "Subscribe to post a message...";
      submitButton.classList.add("block-submit");

      messageSubmit.appendChild(container);
    });
}

async function subscribed() {
  await fetch("../views/topic-display-form.html")
    .then((response) => response.text())
    .then((data) => {
      if (document.getElementById("message-submit-container")) {
        const temp = document.getElementById("message-submit-container");
        messageSubmit.removeChild(temp);
      }
      const container = document.createElement("div");

      container.id = "message-submit-container";
      container.innerHTML = data;

      messageSubmit.appendChild(container);
    });
  messageElement();
}

function messageElement() {
  var messageForm = document.forms["message-create-form"];
  const messageBody = document.getElementById("message-body");
  const messages = document.getElementById("messages");
  const error = document.createElement("p");

  async function submitWatch(event) {
    event.preventDefault();
    error.textContent = ""; //Clear the error element

    var hasError = false;
    const formData = new FormData(messageForm);

    if (!formData.get("message-body").trim()) {
      error.textContent = "You can't submit an empty text box!";
      error.style = "color: red; font-size: x-large;";
      error.id = "error";

      hasError = true;

      return messageForm.append(error);
    } else if (hasError === false && document.getElementById("error")) {
      messageForm.removeChild(document.getElementById("error"));
    }

    formData.append("topic_id", topicId);

    const data = Object.fromEntries(formData.entries());
    const response = await apiFetch("/api/post/message", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (document.getElementById("no-messages")) {
      messages.removeChild(document.getElementById("no-messages"));
    }

    const container = document.createElement("div");
    const content = document.createElement("p");
    const username = document.createElement("p");

    container.className = "message-container";
    content.id = result.body._id;
    content.textContent = result.body.body;
    username.id = result.body.userId;
    username.textContent = result.body.username;
    username.className = "message-username";
    messageBody.value = "";

    container.appendChild(username);
    container.appendChild(content);
    messages.prepend(container);

    if (hasError) {
      messageForm.removeChild(error);
    }
  }

  messageForm.addEventListener("submit", submitWatch);
}

export async function getSubIds() {
  const response = await apiFetch("/api/get/subscriptions");
  const subscriptions = await response.json();
  var subIds = [];
  subscriptions.body.topics.forEach((topic) => {
    subIds.push(topic._id);
  });
  return subIds;
}

export async function checkIfSubscribed() {
  const subIds = await getSubIds();
  if (!subIds.includes(topicId)) {
    notSubscribed();
  } else {
    subscribed();
  }
}
