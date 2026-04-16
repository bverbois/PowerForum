const response = await fetch("/api/topics");
const data = await response.json();

const container = document.getElementById("table-body");

data.body.forEach((topic) => {
  const row = document.createElement("tr");
  const id = document.createElement("td");
  const title = document.createElement("td");
  const accessCount = document.createElement("td");

  id.textContent = topic._id;
  title.textContent = topic.name;
  accessCount.textContent = topic.accessCounter;

  row.appendChild(id);
  row.appendChild(title);
  row.appendChild(accessCount);
  container.appendChild(row);
});
