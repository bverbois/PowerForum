import { apiFetch } from "./apiFetch.js";
import { confirmDelete } from "./confirmModal.js";

const response = await apiFetch("/api/topics");
const subscriptions = await apiFetch("/api/get/subscriptions");
const user = await apiFetch("/api/get/user");

const data = await response.json();
const subscriptionData = await subscriptions.json();
const userData = await user.json();

let subIds = [];
subscriptionData.body.topics.forEach((sub) => {
  subIds.push(sub._id);
});

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

  if (subIds.includes(topic._id)) {
    subscription.name = "subscribed";
    subscription.className = "unsubscribe";

    subscribedTopics.appendChild(topicElement);
  } else {
    subscription.name = "unsubscribed";
    subscription.className = "subscribe";

    unsubscribedTopics.appendChild(topicElement);
  }

  topicElement.id = topic._id;
  topicElement.className = "topic-container";
  header.style = "display: flex; align-items: center";
  title.textContent = topic.name;
  title.href = `./topic/${topic._id}`;
  description.className = "trailoff";
  description.textContent = topic.description;
  deleteTopicButton.className = "delete";

  subscription.addEventListener("click", async (event) => {
    if (subscription.name === "unsubscribed") {
      await apiFetch(`/api/post/subscription/${topicElement.id}`);

      subscription.className = "unsubscribe";
      subscription.name = "subscribed";

      let temp = unsubscribedTopics.removeChild(topicElement);
      subscribedTopics.appendChild(temp);

      return;
    } else if (subscription.name === "subscribed") {
      await apiFetch(`/api/delete/subscription/${topicElement.id}`);

      subscription.className = "subscribe";
      subscription.name = "unsubscribed";

      let temp = subscribedTopics.removeChild(topicElement);
      unsubscribedTopics.appendChild(temp);

      return;
    } else {
      console.log("something bad happened rip");
    }
  });

  deleteTopicButton.addEventListener("click", async (event) => {
    const confirmed = await confirmDelete(
      "Are you sure you want to delete this topic?",
    );
    if (!confirmed) {
      return;
    }

    await apiFetch(`/api/delete/topic/${topicElement.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (subscription.name === "unsubscribed") {
      unsubscribedTopics.removeChild(topicElement);
    } else {
      subscribedTopics.removeChild(topicElement);
    }
  });

  header.appendChild(subscription);
  header.appendChild(title);

  const sub = subscriptionData.body.topics.find((x) => x._id == topic._id);
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
  container.appendChild(subscribedTopics);
  container.appendChild(unsubscribedTopics);
});
