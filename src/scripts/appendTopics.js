const response = await fetch("/api/topics");
const data = await response.json();
console.log(data);

const container = document.getElementById("main");
let i = 0;
data.body.forEach((item) => {
  const title = document.createElement("a");
  const description = document.createElement("p");
  title.textContent = `Title: ${item.name}`;
  title.href = "./topic/" + item._id;
  description.textContent = `Description: ${item.description}`;
  container.appendChild(title);
  container.appendChild(description);

  i++;
});

// const options = ["Item1", "Item2", "Item3"];
// options.forEach((item) => {
//   const list = document.createElement("li");
//   list.textContent = item;
//   container.appendChild(list);
// });
