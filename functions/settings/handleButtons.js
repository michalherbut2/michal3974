const { glob } = require("glob");
const path = require("path");

module.exports = async (client) => {
  try {
    // Grab all the command files from the buttons directory
    const buttonFiles = await new Promise((resolve, reject) => {
      glob(`${process.cwd()}/buttons/*.js`, (err, files) => {
        if (err) {
          return reject(err);
        }
        resolve(files);
      });
    });

    // Process each button file
    buttonFiles.forEach((file) => {
      try {
        const button = require(file);

        if (!button?.data || !button?.execute) {
          throw new Error(
            `[WARNING] The button at ${file} is missing a required "data" or "execute" property.`
          );
        }

        client.buttons.set(button.data.name, button);
      } catch (buttonError) {
        console.error(`Failed to load button from file ${file}:`, buttonError);
      }
    });
  } catch (error) {
    console.error("Failed to load buttons:", error);
  }
};