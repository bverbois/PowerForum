import { navbar } from "./navbar.js";

const navbarElement = document.getElementById("navbar");
if (navbarElement) {
  navbarElement.innerHTML = await navbar();
}
