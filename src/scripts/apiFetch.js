// Wrapper around fetch for protected /api routes. When the session has
// expired the server replies 401; in that case send the user to the login
// page and halt the caller (the returned promise never resolves, so any
// downstream `.json()` parsing is skipped while the browser navigates away).
export async function apiFetch(input, init) {
  const response = await fetch(input, init);
  if (response.status === 401) {
    window.location.href = "/user/login";
    return new Promise(() => {});
  }
  return response;
}
