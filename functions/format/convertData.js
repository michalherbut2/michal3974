const xml2js = require("xml2js");

module.exports = async (data) => {
  try {
    const parser = new xml2js.Parser();
    const output = await parser.parseStringPromise(data);
    return output;
  } catch (error) {
    console.error("Error parsing XML:", error);
    throw new Error("Failed to parse XML data.");
  }
};