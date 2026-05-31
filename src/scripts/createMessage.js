import { apiFetch } from "./apiFetch.js";
import { buildMessageElement, getCurrentUserId } from "./renderMessage.js";

const paths = window.location.pathname.split("/");
const topicId = paths[paths.length - 1];
const messageSubmit = document.getElementById("message-submit");

export async function renderMessageForm() {
  const response = await fetch("../views/topic-display-form.html");
  const data = await response.text();

  if (document.getElementById("message-submit-container")) {
    const temp = document.getElementById("message-submit-container");
    messageSubmit.removeChild(temp);
  }

  const container = document.createElement("div");
  container.id = "message-submit-container";
  container.innerHTML = data;
  messageSubmit.appendChild(container);

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

    const currentUserId = await getCurrentUserId();
    messages.prepend(buildMessageElement(result.body, currentUserId));
    messageBody.value = "";

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
