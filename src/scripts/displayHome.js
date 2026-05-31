import { apiFetch } from "./apiFetch.js";
import { confirmDelete } from "./confirmModal.js";

const topicsContainer = document.getElementById("popular-topics");
const messagesContainer = document.getElementById("recent-messages");

renderPopularTopics();
renderRecentMessages();
syncTitleWrap();
window.addEventListener("resize", syncTitleWrap);

// Keeps the two section titles wrapping in lockstep: if either would overflow a
// single line at the current width, both break one word per line; otherwise both
// stay on one line. (Their different lengths mean CSS alone can't sync the wrap.)
function syncTitleWrap() {
  const titles = document.querySelectorAll(".home-column h1");

  // Measure in the natural (unstacked) state first.
  titles.forEach((title) => title.classList.remove("title-stacked"));

  const needsWrap = [...titles].some((title) => {
    const previous = title.style.whiteSpace;
    title.style.whiteSpace = "nowrap";
    const overflows = title.scrollWidth > title.clientWidth;
    title.style.whiteSpace = previous;
    return overflows;
  });

  if (needsWrap) {
    titles.forEach((title) => title.classList.add("title-stacked"));
  }
}

async function renderPopularTopics() {
  const [topicsRes, subsRes, userRes] = await Promise.all([
    apiFetch("/api/topics"),
    apiFetch("/api/get/subscriptions"),
    apiFetch("/api/get/user"),
  ]);
  const data = await topicsRes.json();
  const subscriptionData = await subsRes.json();
  const userData = await userRes.json();

  const subIds = subscriptionData.body.topics.map((sub) => sub._id);
  const currentUserId = userData.body._id;

  const popular = data.body
    .slice()
    .sort((a, b) => (b.accessCounter ?? 0) - (a.accessCounter ?? 0))
    .slice(0, 10);

  if (popular.length === 0) {
    topicsContainer.appendChild(placeholder("No topics yet..."));
    return;
  }

  popular.forEach((topic) => {
    const topicElement = document.createElement("div");
    const header = document.createElement("div");
    const subscription = document.createElement("button");
    const title = document.createElement("a");
    const deleteTopicButton = document.createElement("button");
    const creator = document.createElement("p");

    topicElement.className = "topic-container";
    header.style = "display: flex; align-items: center";

    if (subIds.includes(topic._id)) {
      subscription.name = "subscribed";
      subscription.className = "unsubscribe";
    } else {
      subscription.name = "unsubscribed";
      subscription.className = "subscribe";
    }

    title.textContent = topic.name;
    title.href = `./topic/${topic._id}`;

    creator.className = "topic-creator";
    creator.textContent = `created by ${topic.username ?? "unknown"}`;

    subscription.addEventListener("click", async () => {
      if (subscription.name === "unsubscribed") {
        await apiFetch(`/api/post/subscription/${topic._id}`);
        subscription.className = "unsubscribe";
        subscription.name = "subscribed";
      } else {
        await apiFetch(`/api/delete/subscription/${topic._id}`);
        subscription.className = "subscribe";
        subscription.name = "unsubscribed";
      }
    });

    deleteTopicButton.className = "delete";
    deleteTopicButton.addEventListener("click", async () => {
      const confirmed = await confirmDelete(
        "Are you sure you want to delete this topic?",
      );
      if (!confirmed) {
        return;
      }
      await apiFetch(`/api/delete/topic/${topic._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      topicElement.remove();
    });

    header.appendChild(subscription);
    header.appendChild(title);
    if (topic.userId === currentUserId) {
      header.appendChild(deleteTopicButton);
    }

    topicElement.appendChild(header);
    topicElement.appendChild(creator);
    topicsContainer.appendChild(topicElement);
  });
}

async function renderRecentMessages() {
  const response = await apiFetch("/api/messages/recent");
  const data = await response.json();

  if (data.body.length === 0) {
    messagesContainer.appendChild(
      placeholder("No recent messages in your subscriptions..."),
    );
    return;
  }

  data.body.forEach((item) => {
    const messageElement = document.createElement("div");
    const meta = document.createElement("div");
    const author = document.createElement("span");
    const topicName = document.createElement("span");
    const body = document.createElement("div");

    messageElement.className = "recent-message";

    meta.className = "recent-message-meta";
    author.className = "message-username";
    author.textContent = item.message.username;
    topicName.className = "recent-message-topic";
    topicName.textContent = ` · ${item.topicName}`;

    body.className = "trailoff";
    body.textContent = item.message.body;

    meta.appendChild(author);
    meta.appendChild(topicName);
    messageElement.appendChild(meta);
    messageElement.appendChild(body);

    messageElement.addEventListener("click", () => {
      window.location.href = `./topic/${item.topicId}?message=${item.message._id}`;
    });

    messagesContainer.appendChild(messageElement);
  });
}

function placeholder(text) {
  const element = document.createElement("h2");
  element.style = "color: gray";
  element.textContent = text;
  return element;
}
