// Reusable confirmation modal. Returns a Promise that resolves to true when the
// user confirms and false when they cancel (or dismiss via the overlay / Escape).
export function confirmDelete(
  message = "Are you sure you want to delete this topic?",
) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    const modal = document.createElement("div");
    const text = document.createElement("p");
    const buttons = document.createElement("div");
    const confirmButton = document.createElement("button");
    const cancelButton = document.createElement("button");

    overlay.className = "modal-overlay";
    modal.className = "modal";
    text.className = "modal-text";
    text.textContent = message;
    buttons.className = "modal-buttons";

    confirmButton.className = "cancel";
    confirmButton.textContent = "Delete";
    cancelButton.className = "submit";
    cancelButton.textContent = "Cancel";

    buttons.appendChild(cancelButton);
    buttons.appendChild(confirmButton);
    modal.appendChild(text);
    modal.appendChild(buttons);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function close(result) {
      document.removeEventListener("keydown", onKeydown);
      overlay.remove();
      resolve(result);
    }

    function onKeydown(event) {
      if (event.key === "Escape") {
        close(false);
      }
    }

    confirmButton.addEventListener("click", () => close(true));
    cancelButton.addEventListener("click", () => close(false));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        close(false);
      }
    });
    document.addEventListener("keydown", onKeydown);

    cancelButton.focus();
  });
}
