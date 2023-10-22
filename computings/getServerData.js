const { default: axios } = require("axios");

module.exports = async () => { 
  const url =
      "http://137.74.7.100:5014/feed/dedicated-server-stats.xml?code=d52a95989e08e61863c06f63e49f4464";

  const { data } = await axios({
    method: "get",
    url: url,
  });

  return data
}