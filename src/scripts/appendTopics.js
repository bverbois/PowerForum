function appendTopics() {
  const container = document.getElementById("body1");
  const options = ["Item1", "Item2", "Item3"];

  options.forEach((item) => {
    const list = document.createElement("li");

    list.textContent = item;

    container.appendChild(list);
  });
}

appendTopics();
