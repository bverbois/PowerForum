const paths = window.location.pathname.split("/");
const topicId = paths[paths.length - 1];
const messageSubmit = document.getElementById("message-submit");
const body = document.getElementById("body1");
const container = document.createElement("div");

async function getSubIds() {
  const response = await fetch("/api/get/subscriptions");
  const subscriptions = await response.json();
  var subIds = [];
  subscriptions.body.topics.forEach((topic) => {
    subIds.push(topic._id);
  });
  return subIds;
}

function notSubscribed() {
  if (document.getElementById("message-submit-container")) {
    const temp = document.getElementById("message-submit-container");
    messageSubmit.removeChild(temp);
  }
  const container = document.createElement("div");
  const content = document.createElement("div");
  const icon = document.createElement("div");
  container.id = "message-submit-container";
  content.textContent = "Subscribe to post a message...";
  container.className = "oneline";
  icon.className = "block";

  container.appendChild(icon);
  container.appendChild(content);
  messageSubmit.appendChild(container);
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

export async function checkIfSubscribed() {
  const subIds = await getSubIds();
  if (!subIds.includes(topicId)) {
    notSubscribed();
  } else {
    subscribed();
  }
}

function messageElement() {
  var messageForm = document.forms["message-create-form"];
  const messageBody = document.getElementById("message-body");
  const button = document.getElementById("message-submit");
  const messages = document.getElementById("messages");
  const error = document.createElement("p");

  async function submitWatch(event) {
    event.preventDefault();

    var hasError = false;
    const formData = new FormData(messageForm);

    if (formData.get("message-body") === "") {
      error.style.color = "red";
      error.textContent = "You can't submit an empty text box!";
      hasError = true;
      return messageForm.append(error);
    }

    formData.append("topic_id", topicId);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch("/api/post/message", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    const container = document.createElement("div");
    const content = document.createElement("p");
    const username = document.createElement("p");

    content.id = result.body._id;
    content.textContent = result.body.body;
    username.id = result.body.userId;
    username.textContent = result.body.username;
    messageBody.value = "";
    hasError ?? messageForm.removeChild(error);
    container.appendChild(username);
    container.appendChild(content);
    messages.appendChild(container);
  }

  messageForm.addEventListener("submit", submitWatch);
}
