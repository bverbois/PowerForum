import { apiFetch } from "./apiFetch.js";

export async function getSubscribedIds() {
  const response = await apiFetch("/api/get/subscriptions");
  const data = await response.json();
  return data.body.topics.map((topic) => topic._id);
}

export function bindSubscriptionToggle(
  button,
  topicId,
  { subscribedClass, unsubscribedClass, isSubscribed, onChange } = {},
) {
  button.name = isSubscribed ? "subscribed" : "unsubscribed";
  button.className = isSubscribed ? subscribedClass : unsubscribedClass;

  button.addEventListener("click", async () => {
    const subscribing = button.name === "unsubscribed";
    const url = subscribing
      ? `/api/post/subscription/${topicId}`
      : `/api/delete/subscription/${topicId}`;

    const response = await apiFetch(url);
    if (!response.ok) {
      return;
    }

    button.name = subscribing ? "subscribed" : "unsubscribed";
    button.className = subscribing ? subscribedClass : unsubscribedClass;
    onChange?.(subscribing);
  });
}
