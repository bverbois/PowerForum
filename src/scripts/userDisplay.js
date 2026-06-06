import { apiFetch } from "./apiFetch.js";
import { confirmDelete } from "./confirmModal.js";
import { bindSubscriptionToggle } from "./subscriptions.js";

const [userRes, subsRes, createdRes] = await Promise.all([
  apiFetch("/api/get/user"),
  apiFetch("/api/get/subscriptions"),
  apiFetch("/api/topics/created"),
]);

const data = await userRes.json();
const subscriptionData = await subsRes.json();
const createdData = await createdRes.json();

const currentUserId = data.body._id;

const username = document.getElementById("username-header");
const subscriptionsDiv = document.getElementById("subscriptions-div");
const myTopicsDiv = document.getElementById("my-topics-div");
const tabSubscriptions = document.getElementById("tab-subscriptions");
const tabMyTopics = document.getElementById("tab-my-topics");

username.textContent = `Welcome, ${data.body.username}`;

const deleteUserButton = document.createElement("button");
deleteUserButton.className = "cancel";
deleteUserButton.textContent = "Delete account";
deleteUserButton.addEventListener("click", async () => {
  const confirmed = await confirmDelete(
    "Are you sure you want to delete your account?",
  );
  if (!confirmed) {
    return;
  }
  const response = await apiFetch("/api/delete/user");
  if (response.ok) {
    window.location.href = "/user/login";
  }
});
username.parentElement.appendChild(deleteUserButton);

const tabContent = document.querySelector(".tab-content");

tabSubscriptions.addEventListener("click", () => {
  tabSubscriptions.className = "tab-active";
  tabMyTopics.className = "tab-inactive";
  tabContent.style.borderRadius = "0 8px 8px 8px";
  subscriptionsDiv.style.display = "";
  myTopicsDiv.style.display = "none";
});

tabMyTopics.addEventListener("click", () => {
  tabMyTopics.className = "tab-active";
  tabSubscriptions.className = "tab-inactive";
  tabContent.style.borderRadius = "8px 0 8px 8px";
  myTopicsDiv.style.display = "";
  subscriptionsDiv.style.display = "none";
});

const subscribedTopics = data.body.topics.filter(
  (topic) => topic.userId?.toString() !== currentUserId,
);

if (subscribedTopics.length > 0) {
  subscribedTopics.forEach((topic) => {
    const topicElement = document.createElement("div");
    const header = document.createElement("div");
    const name = document.createElement("a");
    const unsubscribe = document.createElement("button");
    const messages = document.createElement("div");

    topicElement.id = topic._id;
    topicElement.className = "topic-container";
    header.className = "topic-header-row";
    name.textContent = topic.name;
    name.href = `./topic/${topic._id}`;

    bindSubscriptionToggle(unsubscribe, topic._id, {
      subscribedClass: "unsubscribe",
      unsubscribedClass: "subscribe",
      isSubscribed: true,
      onChange: () => {
        subscriptionsDiv.removeChild(topicElement);
        if (subscriptionsDiv.children.length === 0) {
          subscriptionsDiv.appendChild(placeholder("No subscriptions yet..."));
        }
      },
    });

    const sub = subscriptionData.body.topics.find(
      (x) => x._id === topic._id,
    );
    if (sub?.hasUnread) {
      const unreadIcon = document.createElement("button");
      unreadIcon.className = "unread-messages";
      header.appendChild(unreadIcon);
    }

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
    topicElement.appendChild(header);
    topicElement.appendChild(messages);
    subscriptionsDiv.appendChild(topicElement);
  });
} else {
  subscriptionsDiv.appendChild(placeholder("No subscriptions yet..."));
}

if (createdData.body.length > 0) {
  createdData.body.forEach((topic) => {
    const topicElement = document.createElement("div");
    const header = document.createElement("div");
    const name = document.createElement("a");
    const deleteTopicButton = document.createElement("button");
    const messages = document.createElement("div");

    topicElement.id = topic._id;
    topicElement.className = "topic-container";
    header.className = "topic-header-row";
    name.textContent = topic.name;
    name.href = `./topic/${topic._id}`;
    deleteTopicButton.className = "delete";

    deleteTopicButton.addEventListener("click", async () => {
      const confirmed = await confirmDelete(
        "Are you sure you want to delete this topic?",
      );
      if (!confirmed) {
        return;
      }
      const response = await apiFetch(`/api/delete/topic/${topic._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        myTopicsDiv.removeChild(topicElement);
        if (myTopicsDiv.children.length === 0) {
          myTopicsDiv.appendChild(placeholder("No topics created yet..."));
        }
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

    header.appendChild(name);
    header.appendChild(deleteTopicButton);
    topicElement.appendChild(header);
    topicElement.appendChild(messages);
    myTopicsDiv.appendChild(topicElement);
  });
} else {
  myTopicsDiv.appendChild(placeholder("No topics created yet..."));
}

function placeholder(text) {
  const el = document.createElement("h2");
  el.className = "muted";
  el.textContent = text;
  return el;
}
