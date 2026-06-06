# PowerForum

A lightweight discussion forum where users can create topics, post messages, and subscribe to threads they care about.

## Features

- **Topics** — create, browse, and delete discussion threads
- **Messages** — post, edit, and delete messages within topics
- **Subscriptions** — subscribe and unsubscribe from topics; unread indicators show new activity
- **User profile** — view your subscriptions and your created topics in one place
- **Recent messages** — home dashboard surfaces the latest messages from your subscriptions
- **Access statistics** — track how many times each topic has been viewed
- **Account management** — register, log in, and delete your account

## Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Runtime  | Node.js                                      |
| Server   | Express.js                                   |
| Database | MongoDB (Atlas)                              |
| Sessions | express-session                              |
| Frontend | Vanilla HTML / CSS / JavaScript (ES modules) |

## Getting Started

### Prerequisites

- Node.js v14 or higher
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or any MongoDB instance)

### Installation

```bash
git clone https://github.com/your-username/power_forum.git
cd power_forum
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
MONGO_URI=your_mongodb_connection_string
MONGO_DB=your_database_name
SESSION_SECRET=your_session_secret
```

### Running

```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
power_forum/
├── app.js                  # Express server entry point
├── controllers/            # Route handlers
├── models/                 # MongoDB query functions
├── middlewares/            # Auth guards
├── services/               # Notification service
└── src/
    ├── views/              # HTML pages
    ├── scripts/            # Client-side JavaScript
    └── styles/             # CSS and icons
```

## Pages

| Route                | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `/`                  | Home — popular topics and recent messages from subscriptions |
| `/topics`            | Browse all topics                                            |
| `/topic/:id`         | View a topic and its messages                                |
| `/topic/create`      | Create a new topic                                           |
| `/user`              | Your profile — subscriptions and created topics              |
| `/user/login`        | Log in                                                       |
| `/user/create`       | Register                                                     |
| `/topics/statistics` | Topic access count statistics                                |
