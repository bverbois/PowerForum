function appendTopics() {
  const container = document.getElementById("main");
  const options = ["Item1", "Item2", "Item3"];

  options.forEach((item) => {
    const l = document.createElement("li");

    l.textContent = item;

    container.appendChild(l);
  });
}

appendTopics();
