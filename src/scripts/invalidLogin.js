const form = document.forms["form1"];
const errElement = document.getElementById("error");

async function check(event) {
  event.preventDefault();
  errElement.textContent = "";

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.authenticated) {
      window.location.href = "/";
    } else {
      errElement.textContent = result.message;
    }
  } catch {
    errElement.textContent = "Something went wrong. Please try again.";
  }
}

form.addEventListener("submit", check);