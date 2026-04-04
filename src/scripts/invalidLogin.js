const form = document.getElementById("form1");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch("/validate", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.validated) {
    const errElement = document.getElementById("error");
    errElement.textContent = "Username or Password is incorrect.";
    const usernameInput = document.getElementById("username");
    usernameInput.style.borderColor = "red";
    usernameInput.style.borderWidth = "2px";
  } else if (result.validated) {
    event.target.submit();
  }
});
