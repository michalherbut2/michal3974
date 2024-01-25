const xml2js = require("xml2js");

module.exports = async data => {
  const parser = new xml2js.Parser();
  let output
  parser.parseString(data, (err, result) => output = result);
  return output
};
