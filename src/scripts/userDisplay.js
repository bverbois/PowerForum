const response = await fetch("/api/get/user");
const data = await response.json();

const username = document.getElementById("username-header");
const topics = document.getElementById("topics-div");

username.textContent = `Welcome, ${data.body.username}`;

if (data.body.topics.length > 0) {
  const container = document.createElement("div");
  data.body.topics.forEach((topic) => {
    const topicElement = document.createElement("div");
    const header = document.createElement("div");
    const name = document.createElement("a");
    //const description = document.createElement("div");
    const unsubscribe = document.createElement("button");
    var messages = document.createElement("div");

    unsubscribe.className = "unsubscribe";

    topicElement.id = topic._id;
    topicElement.className = "topic-container";
    name.textContent = `${topic.name}`;
    name.href = `./topic/${topic._id}`;
    //description.textContent = topic.description;

    unsubscribe.addEventListener("click", (event) => {
      fetch(`/api/delete/subscription/${topicElement.id}`);
      container.removeChild(topicElement);
    });

    if (topic.latestTwo?.length > 0) {
      topic.latestTwo.forEach((msg) => {
        const message = document.createElement("div");

        message.id = msg._id;
        message.textContent = `${msg.username}: ${msg.body}`;

        messages.appendChild(message);
      });
    }

    header.appendChild(unsubscribe);
    header.appendChild(name);
    topicElement.appendChild(header);
    //topicElement.appendChild(description);
    topicElement.appendChild(messages);
    container.appendChild(topicElement);
  });
  topics.appendChild(container);
}
