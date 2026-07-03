// Demo-mode per-session database lifecycle:
//  - each browser session gets its own throwaway database "s_<sessionID>",
//  - it is seeded on the session's first request,
//  - and dropped automatically 30 minutes after it is created.
// A startup sweep drops any leftover session databases from a previous run.
import { als } from "./sessionContext.js";
import { Database } from "./database.js";
import { seedDatabase } from "../seed/seedData.js";

const DB_PREFIX = "s_";
// Delete each session database this long after it is created. Defaults to 30
// minutes; DEMO_TTL_MS can override it (handy for testing).
const TTL_MS = Number(process.env.DEMO_TTL_MS) || 30 * 60 * 1000;

const seeded = new Set(); // sids whose database has been seeded this process
const inFlight = new Map(); // sid -> in-progress seeding promise (dedupes concurrent first hits)

// Drops a database, refusing anything that is not one of our session databases
// so cleanup can never touch the real MONGO_DB, admin, local or config.
function dropSessionDb(name) {
  if (!name.startsWith(DB_PREFIX)) {
    throw new Error(`Refusing to drop non-session database: ${name}`);
  }
  return Database.getInstance()
    .rawDb(name)
    .dropDatabase()
    .then(() => console.log(`Dropped demo database ${name}`))
    .catch((err) => console.error(`Failed to drop ${name}:`, err.message));
}

async function ensureSeeded(sid) {
  if (seeded.has(sid)) return;
  if (inFlight.has(sid)) return inFlight.get(sid);

  const promise = (async () => {
    const dbName = DB_PREFIX + sid;
    await seedDatabase(Database.getInstance().rawDb(dbName));
    seeded.add(sid);
    // Schedule the one-and-only cleanup for this database.
    setTimeout(() => {
      seeded.delete(sid);
      dropSessionDb(dbName);
    }, TTL_MS).unref();
    console.log(`Seeded demo database ${dbName} (auto-delete in 30 min)`);
  })();

  inFlight.set(sid, promise);
  try {
    await promise;
  } finally {
    inFlight.delete(sid);
  }
}

// Seeds the session's database on first touch, then runs the rest of the
// request inside the async context that routes DB calls to that database.
export async function sessionDbMiddleware(req, _res, next) {
  try {
    const sid = req.sessionID;
    await ensureSeeded(sid);
    als.run({ sid }, () => next());
  } catch (err) {
    next(err);
  }
}

// Startup safety net: a process restart clears the pending 30-min timers and the
// in-memory session store, so any pre-existing session database is an orphan.
export async function dropAllSessionDbs() {
  const db = Database.getInstance();
  try {
    const names = await db.listDbNames();
    const sessionDbs = names.filter((n) => n.startsWith(DB_PREFIX));
    await Promise.all(sessionDbs.map((n) => dropSessionDb(n)));
    console.log(
      `Startup cleanup: dropped ${sessionDbs.length} leftover demo database(s).`,
    );
  } catch (err) {
    console.warn(
      "Startup cleanup skipped (listDatabases unavailable):",
      err.message,
    );
  }
}
