import Cookies from "js-cookie";
// Remove the incorrect zod import
const API_BASE_URL = "http://127.0.0.1:8000/";

const fetchData = async (
  endpoint,
  method = "GET",
  body = any,
  isFormData = false,
  token = null
) => {
  // Check if API_BASE_URL is defined
  if (!API_BASE_URL) {
    throw new Error(
      "API_BASE_URL is not defined. Check your environment variables."
    );
  }

  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from cookie if not provided
  const accessToken = token || Cookies.get("accessToken");

  const options = {
    method: method,
    headers: {},
  };

  if (accessToken) {
    options.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Only set body if it's provided
  if (isFormData && body instanceof FormData) {
    options.body = body; // If formData, directly assign it to body
  } else if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body); // If JSON, stringify the body
  }

  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export { fetchData };
