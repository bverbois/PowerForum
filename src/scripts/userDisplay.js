const response = await fetch("/api/get/user");
const data = await response.json();

const username = document.getElementById("username-header");
const topics = document.getElementById("topics-div");

username.textContent = data.body.username;

if (data.body.topics.length > 0) {
  const container = document.createElement("div");
  data.body.topics.forEach((topic) => {
    console.log("Topic: " + topic);

    const name = document.createElement("a");
    const description = document.createElement("div");
    const unsubscribe = document.createElement("button");
    var messages = document.createElement("div");

    name.textContent = `${topic.name}`;
    name.href = `./topic/${topic._id}`;
    unsubscribe.id = topic._id;
    unsubscribe.addEventListener((event) => {
      //fetch("/api/delete/favorite");
      //remove the favorite from the dom
    });
    description.textContent = topic.description;

    if (topic.latestTwo?.length > 0) {
      topic.latestTwo.forEach((msg) => {
        const message = document.createElement("div");

        message.id = msg._id;
        message.textContent = msg.body;

        messages.appendChild(message);
      });
    }

    container.appendChild(name);
    container.appendChild(unsubscribe);
    container.appendChild(description);
    container.appendChild(messages);
  });
  topics.appendChild(container);
}
