const response = await fetch("/api/get/user");
const subscriptions = await fetch("/api/get/subscriptions");

const data = await response.json();
const subscriptionData = await subscriptions.json();

let subIds = [];
subscriptionData.body.topics.forEach((sub) => {
  subIds.push(sub._id);
});

const username = document.getElementById("username-header");
const container = document.getElementById("topics-div");

username.textContent = `Welcome, ${data.body.username}`;

if (data.body.topics.length > 0) {
  data.body.topics.forEach((topic) => {
    const topicElement = document.createElement("div");
    const header = document.createElement("div");
    const name = document.createElement("a");
    const unsubscribe = document.createElement("button");
    var messages = document.createElement("div");

    unsubscribe.className = "unsubscribe";

    topicElement.id = topic._id;
    topicElement.className = "topic-container";
    name.textContent = `${topic.name}`;
    name.href = `./topic/${topic._id}`;

    header.style = "display: flex; align-items: center";

    unsubscribe.addEventListener("click", (event) => {
      fetch(`/api/delete/subscription/${topicElement.id}`);
      container.removeChild(topicElement);
    });

    if (topic.latestTwo?.length > 0) {
      topic.latestTwo.forEach((msg) => {
        const message = document.createElement("div");

        message.id = msg._id;
        message.textContent = `${msg.username}: ${msg.body}`;
        message.className = "trailoff";

        messages.appendChild(message);
      });
    }

    header.appendChild(unsubscribe);
    header.appendChild(name);
    const sub = subscriptionData.body.topics.find((x) => x._id == topic._id);
    if (sub?.hasUnread) {
      const unreadIcon = document.createElement("button");
      unreadIcon.className = "unread-messages";
      header.appendChild(unreadIcon);
    }

    topicElement.appendChild(header);
    topicElement.appendChild(messages);
    container.appendChild(topicElement);
  });
}
