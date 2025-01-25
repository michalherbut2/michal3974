const axios = require("axios");

module.exports = async () => {
  const url = "http://185.239.211.39:8700/feed/dedicated-server-stats.xml?code=C4w5vUMI";

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from URL:", error.message);
    throw new Error("Failed to fetch data from the server.");
  }
};