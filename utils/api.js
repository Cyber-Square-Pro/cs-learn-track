const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (
  endpoint,
  method = "GET",
  body = null,
  isFormData = false,
  token = null
) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method: method,
    headers: {},
  };
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

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

/*
import React, { useEffect, useState } from 'react';
import { fetchData } from '../utils/api';

const Page = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Example of a GET request
    const getData = async () => {
      try {
        const response = await fetchData('GET', '/api/data');
        setData(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, []);

  const handlePostRequest = async () => {
    // Example of a POST request
    try {
      const postData = { key: 'value' };
      const response = await fetchData('POST', '/api/data', postData);
      console.log('Post response:', response);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  return (
    <div>
      <h1>Data</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
      <button onClick={handlePostRequest}>Send POST Request</button>
    </div>
  );
};

export default Page;
 */
// fetchData('/your-endpoint', 'GET', null, false, 'your-bearer-token');
