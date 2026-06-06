import { Database } from "../connections/database.js";
import { ObjectId } from "mongodb";

const collectionName = "topics";
const database = Database.getInstance();
const collection = database.collection(collectionName);

export async function submitTopic(topic, userId) {
  const userOid = new ObjectId(userId);

  const topicToCreate = {
    name: topic.name,
    description: topic.description,
    userId: userOid,
    messages: [],
    topics: [],
    accessCounter: 0,
  };

  const response = await collection.insertOne(topicToCreate);
  return response;
}

export async function getAllTopics() {
  let response = await collection
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $addFields: {
          username: { $ifNull: [{ $arrayElemAt: ["$creator.username", 0] }, "[deleted user]"] },
        },
      },
      { $project: { creator: 0 } },
    ])
    .toArray();

  let topicIds = [];
  response.forEach((topic) => {
    topicIds.push(topic._id);
  });

  collection.updateMany(
    { _id: { $in: topicIds } },
    { $inc: { accessCounter: 1 } },
  );

  return response;
}

export async function getRecentMessagesForSubscriptions(topicIds, excludeUserId) {
  const excludeOid = new ObjectId(excludeUserId);

  const response = await collection
    .aggregate([
      { $match: { _id: { $in: topicIds } } },
      { $unwind: "$messages" },
      { $match: { "messages.userId": { $ne: excludeOid } } },
      { $sort: { "messages._id": -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          topicId: "$_id",
          topicName: "$name",
          message: "$messages",
        },
      },
    ])
    .toArray();

  return response;
}

export async function getTopicsWithLatest(topics) {
  let topicIds = [];

  topics.forEach((topic) => {
    topicIds.push(topic._id);
  });

  const response = await collection
    .find({ _id: { $in: topicIds } })
    .project({
      name: 1,
      description: 1,
      userId: 1,
      latestTwo: { $slice: ["$messages", -2] },
    })
    .toArray();

  collection.updateMany(
    { _id: { $in: topicIds } },
    { $inc: { accessCounter: 1 } },
  );

  return response;
}

export async function getTopic(topicId) {
  const oid = new ObjectId(topicId);

  const response = await collection.findOne({ _id: oid });

  collection.updateOne({ _id: oid }, { $inc: { accessCounter: 1 } });

  return response;
}

export async function getTopicsByCreator(userId) {
  const oid = new ObjectId(userId);
  return collection
    .find({ userId: oid })
    .project({
      name: 1,
      description: 1,
      userId: 1,
      latestTwo: { $slice: ["$messages", -2] },
    })
    .toArray();
}

export async function deleteTopic(id) {
  const response = await collection.deleteOne({ _id: new ObjectId(id) });

  return response;
}
