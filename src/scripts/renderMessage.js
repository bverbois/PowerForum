import { apiFetch } from "./apiFetch.js";
import { confirmDelete } from "./confirmModal.js";

// Cached lookup of the logged-in user's id so callers can decide whether a
// message belongs to the current user (and therefore shows edit/delete icons).
let currentUserIdPromise;
export function getCurrentUserId() {
  if (!currentUserIdPromise) {
    currentUserIdPromise = apiFetch("/api/get/user")
      .then((response) => response.json())
      .then((data) => data.body._id);
  }
  return currentUserIdPromise;
}

// Builds the DOM for a single message. message = { _id, body, userId, username }.
// When the message belongs to currentUserId, an edit (pencil) and delete (trash)
// control is shown, right-aligned with the pencil on the left and trash on the right.
export function buildMessageElement(message, currentUserId) {
  const container = document.createElement("div");
  const header = document.createElement("div");
  const username = document.createElement("p");
  const content = document.createElement("p");

  container.className = "message-container";
  header.className = "message-header";

  username.textContent = message.username;
  username.className = "message-username";

  // The id stays on the body so the topic page can scroll/highlight a message.
  content.id = message._id;
  content.textContent = message.body;

  header.appendChild(username);

  if (message.userId === currentUserId) {
    const actions = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    actions.className = "message-actions";
    editButton.className = "edit";
    deleteButton.className = "delete";

    editButton.addEventListener("click", startEdit);

    deleteButton.addEventListener("click", async () => {
      const confirmed = await confirmDelete(
        "Are you sure you want to delete this message?",
      );
      if (!confirmed) {
        return;
      }
      const response = await apiFetch(`/api/delete/message/${message._id}`);
      if (response.ok) {
        container.remove();
      }
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    header.appendChild(actions);
  }

  container.appendChild(header);
  container.appendChild(content);

  function startEdit() {
    if (container.querySelector(".edit-message-box")) {
      return; // already editing
    }

    const textarea = document.createElement("textarea");
    const editActions = document.createElement("div");
    const save = document.createElement("button");
    const cancel = document.createElement("button");
    const error = document.createElement("p");

    textarea.className = "edit-message-box";
    textarea.value = content.textContent;
    editActions.className = "edit-actions";
    save.className = "submit";
    save.textContent = "Save";
    cancel.className = "cancel";
    cancel.textContent = "Cancel";

    content.style.display = "none";
    editActions.appendChild(save);
    editActions.appendChild(cancel);
    container.appendChild(textarea);
    container.appendChild(editActions);

    function finishEdit() {
      textarea.remove();
      editActions.remove();
      error.remove();
      content.style.display = "";
    }

    cancel.addEventListener("click", finishEdit);

    save.addEventListener("click", async () => {
      const newBody = textarea.value.trim();
      if (!newBody) {
        error.textContent = "Message cannot be empty.";
        error.className = "edit-error";
        editActions.after(error);
        return;
      }

      const response = await apiFetch(`/api/edit/message/${message._id}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ body: newBody }),
      });

      if (response.ok) {
        content.textContent = newBody;
        finishEdit();
      }
    });

    textarea.focus();
  }

  return container;
}
