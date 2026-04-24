const response = await fetch("/api/get/user/hasUnread");
const data = await response.json();

console.log(data);
