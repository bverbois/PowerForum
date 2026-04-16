export async function navbar() {
  const navbar = await fetch("../views/navbar.html").then((response) =>
    response.text(),
  );
  return navbar;
}
