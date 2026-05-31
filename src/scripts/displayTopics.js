import { apiFetch } from "./apiFetch.js";
import { confirmDelete } from "./confirmModal.js";
import { bindSubscriptionToggle } from "./subscriptions.js";

const response = await apiFetch("/api/topics");
const subscriptions = await apiFetch("/api/get/subscriptions");
const user = await apiFetch("/api/get/user");

const data = await response.json();
const subscriptionData = await subscriptions.json();
const userData = await user.json();

const subIds = subscriptionData.body.topics.map((sub) => sub._id);

const container = document.getElementById("main-div");
const subscribedTopics = document.createElement("div");
const unsubscribedTopics = document.createElement("div");

subscribedTopics.name = "subscribed-topics";
unsubscribedTopics.name = "unsubscribed-topics";

data.body.forEach((topic) => {
  const topicElement = document.createElement("div");
  const header = document.createElement("div");
  const title = document.createElement("a");
  const description = document.createElement("div");
  const subscription = document.createElement("button");
  const deleteTopicButton = document.createElement("button");

  const isSubscribed = subIds.includes(topic._id);
  (isSubscribed ? subscribedTopics : unsubscribedTopics).appendChild(topicElement);

  topicElement.id = topic._id;
  topicElement.className = "topic-container";
  header.className = "topic-header-row";
  title.textContent = topic.name;
  title.href = `./topic/${topic._id}`;
  description.className = "trailoff";
  description.textContent = topic.description;
  deleteTopicButton.className = "delete";

  bindSubscriptionToggle(subscription, topic._id, {
    subscribedClass: "unsubscribe",
    unsubscribedClass: "subscribe",
    isSubscribed,
    onChange: (subscribing) => {
      const from = subscribing ? unsubscribedTopics : subscribedTopics;
      const to = subscribing ? subscribedTopics : unsubscribedTopics;
      to.appendChild(from.removeChild(topicElement));
    },
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
      topicElement.remove();
    }
  });

  header.appendChild(subscription);
  header.appendChild(title);

  const sub = subscriptionData.body.topics.find((x) => x._id === topic._id);
  if (sub?.hasUnread) {
    const unreadIcon = document.createElement("button");
    unreadIcon.className = "unread-messages";
    header.appendChild(unreadIcon);
  }
  if (topic.userId === userData.body._id) {
    header.appendChild(deleteTopicButton);
  }

  topicElement.appendChild(header);
  topicElement.appendChild(description);
});

container.appendChild(subscribedTopics);
container.appendChild(unsubscribedTopics);
