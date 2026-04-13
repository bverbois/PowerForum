const response = await fetch("/api/get/subscriptions");
const subscriptions = await response.json();
const paths = window.location.pathname.split("/");
const topicId = paths[paths.length - 1];
//const body = document.getElementById("body1");

let subIds = [];
subscriptions.body.topics.forEach((topic) => {
  subIds.push(topic._id);
});
const messageSubmit = document.getElementById("message-submit");
if (!subIds.includes(topicId)) {
  const container = document.createElement("div");
  const content = document.createElement("div");
  const icon = document.createElement("div");
  content.textContent = "Subscribe to post a message...";
  container.className = "oneline";
  icon.className = "block";

  container.appendChild(icon);
  container.appendChild(content);
  messageSubmit.appendChild(container);
} else {
  await fetch("../views/topic-display-form.html")
    .then((response) => response.text())
    .then((data) => {
      const container = document.createElement("div");
      container.innerHTML = data;
      messageSubmit.appendChild(container);
    });
  messageElement();
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
