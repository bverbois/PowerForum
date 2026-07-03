// Demo seed data. Inserted fresh into every session's throwaway database so a
// new visitor never lands on an empty forum. Shapes mirror the implicit schemas
// used by the models (see models/UserModel.js, models/TopicModel.js,
// models/MessageModel.js). Passwords are plaintext because authenticateUser
// compares them directly.
import { ObjectId } from "mongodb";

// Credentials surfaced on the login page for one-click demoing.
export const DEMO_CREDENTIALS = { username: "alice", password: "password" };

export async function seedDatabase(db) {
  const aliceId = new ObjectId();
  const bobId = new ObjectId();
  const carolId = new ObjectId();

  const topicWelcomeId = new ObjectId();
  const topicJsId = new ObjectId();
  const topicSetupId = new ObjectId();

  // Message ids we need to reference from users.messages.
  const mWelcomeBob = new ObjectId();
  const mWelcomeAlice = new ObjectId();
  const mJsAlice = new ObjectId();
  const mJsBob = new ObjectId();
  const mSetupCarol = new ObjectId();

  const users = [
    {
      _id: aliceId,
      name: "Alice Demo",
      username: "alice",
      password: "password",
      messages: [{ _id: mWelcomeAlice }, { _id: mJsAlice }],
      // Subscriptions to topics created by others.
      topics: [{ _id: topicJsId, userId: bobId, hasUnread: true }],
    },
    {
      _id: bobId,
      name: "Bob Demo",
      username: "bob",
      password: "password",
      messages: [{ _id: mWelcomeBob }, { _id: mJsBob }],
      topics: [{ _id: topicWelcomeId, userId: aliceId, hasUnread: false }],
    },
    {
      _id: carolId,
      name: "Carol Demo",
      username: "carol",
      password: "password",
      messages: [{ _id: mSetupCarol }],
      topics: [],
    },
  ];

  const topics = [
    {
      _id: topicWelcomeId,
      name: "Welcome to PowerForum",
      description: "Say hello and introduce yourself to the community.",
      userId: aliceId,
      messages: [
        {
          _id: mWelcomeAlice,
          body: "Welcome everyone! This is a demo forum — feel free to poke around.",
          userId: aliceId,
          username: "alice",
        },
        {
          _id: mWelcomeBob,
          body: "Thanks Alice, glad to be here!",
          userId: bobId,
          username: "bob",
        },
      ],
      topics: [],
      accessCounter: 12,
    },
    {
      _id: topicJsId,
      name: "Best JavaScript tips",
      description: "Share your favorite JS tricks and gotchas.",
      userId: bobId,
      messages: [
        {
          _id: mJsBob,
          body: "Optional chaining (?.) has saved me from so many null checks.",
          userId: bobId,
          username: "bob",
        },
        {
          _id: mJsAlice,
          body: "Don't sleep on structuredClone() for deep copies.",
          userId: aliceId,
          username: "alice",
        },
      ],
      topics: [],
      accessCounter: 27,
    },
    {
      _id: topicSetupId,
      name: "Show off your setup",
      description: "Post a description of your development environment.",
      userId: carolId,
      messages: [
        {
          _id: mSetupCarol,
          body: "Neovim + tmux + a mechanical keyboard. Nothing beats it.",
          userId: carolId,
          username: "carol",
        },
      ],
      topics: [],
      accessCounter: 5,
    },
  ];

  await db.collection("users").insertMany(users);
  await db.collection("topics").insertMany(topics);
}
