// Demo-mode request context. Carries the current browser session id through the
// async call stack so the Database proxy can route every DB call to that
// session's own throwaway database. Kept dependency-free to avoid import cycles
// between database.js and sessionDb.js.
import { AsyncLocalStorage } from "async_hooks";

export const als = new AsyncLocalStorage();

// Name of the per-session database for the request currently in flight.
export function currentSessionDbName() {
  const store = als.getStore();
  if (!store || !store.sid) {
    throw new Error(
      "No session context: a per-session DB operation ran outside sessionDbMiddleware.",
    );
  }
  return "s_" + store.sid;
}
