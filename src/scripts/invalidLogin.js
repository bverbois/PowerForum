const form = document.forms["form1"];
const errElement = document.getElementById("error");

async function check(event) {
  errElement.textContent = "";
  event.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  var response = await fetch("/api/authenticate", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.authenticated) {
    errElement.textContent = result.message;
  } else if (result.authenticated) {
    window.location.href = "/user";
  }
}

form.addEventListener("submit", check);