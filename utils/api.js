const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

const fetchData = async (endpoint, method = "GET", body = null, isFormData = false) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method: method,
    headers: {},
  };

  if (isFormData && body instanceof FormData) {
    options.body = body; // If formData, directly assign it to body
  } else if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body); // If JSON, stringify the body
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export { fetchData };