const form = document.forms["form1"];
const errElement = document.getElementById("error");

async function check(event) {
  event.preventDefault();

  errElement.textContent = "";
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/post/user", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = "/user/login";
    } else if (result.body?.code === 11000) {
      errElement.textContent = "Username is already taken.";
    } else if (result.body?.code === 121) {
      errElement.textContent = "All fields are required.";
    } else {
      errElement.textContent = "There was an error creating your account.";
    }
  } catch {
    errElement.textContent = "Something went wrong. Please try again.";
  }
}

form.addEventListener("submit", check);
