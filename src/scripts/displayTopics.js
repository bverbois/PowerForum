import { navbar } from "./navbar.js";

const response = await fetch("/api/topics");
const subscriptions = await fetch("/api/get/subscriptions");

const data = await response.json();
const subscriptionData = await subscriptions.json();

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
  description.textContent = topic.description;

  subscription.addEventListener("click", async (event) => {
    if (subscription.name === "unsubscribed") {
      await fetch(`/api/post/subscription/${topicElement.id}`);
      subscription.className = "unsubscribe";
      subscription.name = "subscribed";

      let temp = unsubscribedTopics.removeChild(topicElement);
      subscribedTopics.appendChild(temp);
      return;
    } else if (subscription.name === "subscribed") {
      await fetch(`/api/delete/subscription/${topicElement.id}`);
      subscription.className = "subscribe";
      subscription.name = "unsubscribed";

      let temp = subscribedTopics.removeChild(topicElement);
      unsubscribedTopics.appendChild(temp);
      return;
    } else {
      console.log("something bad happened rip");
    }
  });

  header.appendChild(subscription);
  header.appendChild(title);
  const sub = subscriptionData.body.topics.find((x) => x._id == topic._id);
  if (sub?.hasUnread) {
    const redCircle = document.createElement("button");
    redCircle.className = "unread-messages";
    header.appendChild(redCircle);
  }

  topicElement.appendChild(header);
  topicElement.appendChild(description);
  container.appendChild(subscribedTopics);
  container.appendChild(unsubscribedTopics);
});
