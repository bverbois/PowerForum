import { apiFetch } from "./apiFetch.js";
import { confirmDelete } from "./confirmModal.js";

const response = await apiFetch("/api/get/user");
const subscriptions = await apiFetch("/api/get/subscriptions");

const data = await response.json();
const subscriptionData = await subscriptions.json();

const currentUserId = data.body._id;

const username = document.getElementById("username-header");
const container = document.getElementById("topics-div");

username.textContent = `Welcome, ${data.body.username}`;

if (data.body.topics.length > 0) {
  data.body.topics.forEach((topic) => {
    const topicElement = document.createElement("div");
    const header = document.createElement("div");
    const name = document.createElement("a");
    const unsubscribe = document.createElement("button");
    const messages = document.createElement("div");
    const deleteTopicButton = document.createElement("button");

    unsubscribe.className = "unsubscribe";
    topicElement.id = topic._id;
    topicElement.className = "topic-container";
    name.textContent = `${topic.name}`;
    name.href = `./topic/${topic._id}`;
    deleteTopicButton.className = "delete";

    header.className = "topic-header-row";

    unsubscribe.addEventListener("click", async () => {
      const unsubResponse = await apiFetch(
        `/api/delete/subscription/${topicElement.id}`,
      );
      if (!unsubResponse.ok) {
        return;
      }
      container.removeChild(topicElement);
      data.body.topics = data.body.topics.filter((x) => x._id !== topic._id);
      if (data.body.topics.length === 0) {
        noTopicsMessage();
      }
    });

    deleteTopicButton.addEventListener("click", async () => {
      const confirmed = await confirmDelete(
        "Are you sure you want to delete this topic?",
      );
      if (!confirmed) {
        return;
      }

      const deleteResponse = await apiFetch(
        `/api/delete/topic/${topicElement.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (deleteResponse.ok) {
        container.removeChild(topicElement);
      }
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
    const sub = subscriptionData.body.topics.find((x) => x._id === topic._id);
    if (sub?.hasUnread) {
      const unreadIcon = document.createElement("button");
      unreadIcon.className = "unread-messages";
      header.appendChild(unreadIcon);
    }

    if (topic.userId === currentUserId) {
      header.appendChild(deleteTopicButton);
    }

    topicElement.appendChild(header);
    topicElement.appendChild(messages);
    container.appendChild(topicElement);
  });
} else {
  noTopicsMessage();
}

function noTopicsMessage() {
  const noTopics = document.createElement("div");
  const textElement = document.createElement("h2");

  noTopics.id = "no-topic-div";
  textElement.textContent = "You aren't subscribed to any topics yet...";
  textElement.className = "muted";

  noTopics.appendChild(textElement);
  container.appendChild(noTopics);
}
