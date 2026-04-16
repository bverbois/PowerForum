const response = await fetch("/api/topics");
const subscriptions = await fetch("/api/get/subscriptions");

const data = await response.json();
const subscriptionData = await subscriptions.json();

let subIds = [];
subscriptionData.body.topics.forEach((sub) => {
  subIds.push(sub._id);
});

const container = document.getElementById("body");
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
  topicElement.appendChild(header);
  topicElement.appendChild(description);
  container.appendChild(subscribedTopics);
  container.appendChild(unsubscribedTopics);
});

/*If a user subscribes to a topic, need to switch to the unsubscribe
className and change fetch event listener function to be 
fetch(`/api/delete/subscription/${topicElement.id}`)*/
