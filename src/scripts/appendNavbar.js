import { navbar } from "./navbar.js";

// Sitewide demo banner. This script and a #navbar div are included on every
// view, so injecting here covers the whole site (including login/create).
if (!document.getElementById("demo-banner")) {
  const banner = document.createElement("div");
  banner.id = "demo-banner";
  banner.textContent =
    "This is a demo of PowerForum. All data inserted by the user will not persist and is automatically deleted 30 minutes after account creation.";
  document.body.prepend(banner);
}

const navbarElement = document.getElementById("navbar");
if (navbarElement) {
  navbarElement.innerHTML = await navbar();
}
