import getAuthHeaders from "../utils/getAuthHeaders";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
          ...(options.headers || {}),
        },
        ...options,
      }
    );

    let data;

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `API Error (${response.status})`
      );
    }

    return data;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

export const apiClient = {
  get: (url, options = {}) =>
    request(url, {
      method: "GET",
      ...options,
    }),

  post: (url, body, options = {}) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: (url, body, options = {}) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: (url, body, options = {}) =>
    request(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: (url, options = {}) =>
    request(url, {
      method: "DELETE",
      ...options,
    }),
};

export default apiClient;
