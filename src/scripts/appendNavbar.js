import { navbar } from "./navbar.js";

const navbarElement = document.getElementById("navbar");
navbarElement.innerHTML = await navbar();
