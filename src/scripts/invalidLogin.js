const form = document.forms["form1"];

async function check(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch("/api/authenticate", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.authenticated) {
    const errElement = document.getElementById("error");
    const usernameInput = document.getElementById("username");

    errElement.textContent = "Username or Password is incorrect.";
    usernameInput.style.borderColor = "red";
    usernameInput.style.borderWidth = "2px";
  } else if (result.authenticated) {
    window.location.href = "/topics";
  }
}

form.addEventListener("submit", check);
