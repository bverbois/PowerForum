const response = await fetch("/api/topics");
const data = await response.json();
console.log(data);

const container = document.getElementById("body");

data.body.forEach((topic) => {
  const topicElement = document.createElement("div");
  const header = document.createElement("div");
  const title = document.createElement("a");
  const description = document.createElement("div");
  const subscription = document.createElement("button");

  subscription.className = "subscribe";
  topicElement.id = topic._id;
  title.textContent = `Title: ${topic.name}`;
  title.href = `./topic/${topic._id}`;
  description.textContent = `Description: ${topic.description}`;

  subscription.addEventListener("click", async (event) => {
    await fetch(`/api/post/subscription/${topicElement.id}`);
    
    container.removeChild(topicElement);
  });

  //subscribe.appendChild(subIcon);
  header.appendChild(subscription);
  header.appendChild(title);
  topicElement.appendChild(header);
  topicElement.appendChild(description);
  container.appendChild(topicElement);
});

function subscribeEvent() {

}

/*If a user subscribes to a topic, need to switch to the unsubscribe
className and change fetch event listener function to be 
fetch(`/api/delete/subscription/${topicElement.id}`)*/