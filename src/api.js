const DEFAULT_BASE_URL = "http://localhost:8000";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()
    ? import.meta.env.VITE_API_BASE_URL
    : DEFAULT_BASE_URL;

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && data.detail
        ? data.detail
        : typeof data === "string"
        ? data
        : "Request failed";
    throw new Error(message);
  }

  return data;
}

export async function listTopics() {
  const res = await fetch(`${BASE_URL}/topics`);
  return handleResponse(res);
}

export async function createTopic(payload) {
  const res = await fetch(`${BASE_URL}/topics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function getTopicWithQA(topicId) {
  const res = await fetch(`${BASE_URL}/topics/${topicId}/qa`);
  return handleResponse(res);
}

