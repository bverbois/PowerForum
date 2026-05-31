import { apiFetch } from "./apiFetch.js";
import { buildMessageElement, getCurrentUserId } from "./renderMessage.js";

const paths = window.location.pathname.split("/");
const topicId = paths[paths.length - 1];
const messageSubmit = document.getElementById("message-submit");

export async function renderMessageForm() {
  const response = await fetch("/views/topic-display-form.html");
  const data = await response.text();

  const existing = document.getElementById("message-submit-container");
  if (existing) {
    messageSubmit.removeChild(existing);
  }

  const container = document.createElement("div");
  container.id = "message-submit-container";
  container.innerHTML = data;
  messageSubmit.appendChild(container);

  messageElement();
}

function messageElement() {
  const messageForm = document.forms["message-create-form"];
  const messageBody = document.getElementById("message-body");
  const messages = document.getElementById("messages");

  const error = document.createElement("p");
  error.id = "error";
  error.style.color = "red";
  error.style.fontSize = "x-large";

  async function submitWatch(event) {
    event.preventDefault();

    const formData = new FormData(messageForm);
    const body = (formData.get("message-body") ?? "").trim();

    if (!body) {
      error.textContent = "You can't submit an empty text box!";
      messageForm.append(error);
      return;
    }
    error.remove();

    formData.append("topic_id", topicId);
    const data = Object.fromEntries(formData.entries());

    const response = await apiFetch("/api/post/message", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      error.textContent = "Your message could not be posted. Please try again.";
      messageForm.append(error);
      return;
    }

    const result = await response.json();

    const noMessages = document.getElementById("no-messages");
    if (noMessages) {
      messages.removeChild(noMessages);
    }

    const currentUserId = await getCurrentUserId();
    messages.prepend(buildMessageElement(result.body, currentUserId));
    messageBody.value = "";
  }

  messageForm.addEventListener("submit", submitWatch);
}
