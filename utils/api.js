    
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

// Dynamic function to handle different endpoints
const fetchData = async (endpoint, method = "GET", body = null) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body); 
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