module.exports = async () => { 
  const url =
      "http://185.239.211.39:8700/feed/dedicated-server-stats.xml?code=C4w5vUMI";

  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error(`Failed to fetch server data: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  return response.text();
}