const { default: axios } = require("axios");

module.exports = async () => { 
  const url =
      "http://185.239.211.39:8700/feed/dedicated-server-stats.xml?code=C4w5vUMI";

  const { data } = await axios({
    method: "get",
    url: url,
  });

  return data
}