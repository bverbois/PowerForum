import { apiFetch } from "./apiFetch.js";

const form = document.forms["form1"];
const errElement = document.getElementById("error");

async function check(event) {
  event.preventDefault();

  errElement.textContent = "";
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await apiFetch("/api/post/topic", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = "/topics";
    } else {
      errElement.textContent = result.body;
    }
  } catch {
    errElement.textContent = "Something went wrong. Please try again.";
  }
}

form.addEventListener("submit", check);
