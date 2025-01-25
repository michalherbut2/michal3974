const getServerConfig = async (db) => {
  try {
    // Prepare and execute the SQL query to get the server configuration
    const stmt = db.prepare("SELECT * FROM config");
    const config = await stmt.all();
    return config;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching server configuration:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

const getConfig = async (db) => {
  try {
    // Fetch the server configuration and convert it to an object
    const configArray = await getServerConfig(db);
    const configObject = Object.fromEntries(
      configArray.map((item) => [item.key, item.value])
    );
    return configObject;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error converting configuration to object:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

module.exports = getConfig;