const messageForm = document.forms["message-create-form"];
const messageBody = document.getElementById("message-body");
const button = document.getElementById("message-submit");
const messages = document.getElementById("messages");
const error = document.createElement("p");

async function submitWatch(event) {
  event.preventDefault();
  const paths = window.location.pathname.split("/");
  const topicId = paths[paths.length - 1];

  const formData = new FormData(messageForm);

  if (formData.get("message-body") === "") {
    error.style.color = "red";
    error.textContent = "Your can't submit an empty text box!";
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

  const content = document.createElement("p");
  content.id = result.body._id;
  content.textContent = result.body.body;
  messageBody.value = "";
  messageForm.removeChild(error);
  messages.appendChild(content);
}

messageForm.addEventListener("submit", submitWatch);
