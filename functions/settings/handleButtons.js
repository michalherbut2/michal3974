const { glob } = require("glob");

module.exports = async client => {
  try {
    // Grab all the command files from the buttons directory
    const buttonFiles = await glob(`${process.cwd()}/buttons/*.js`);
    // slash commands
    buttonFiles.map(file => {
      const button = require(file);

      if (!button?.data || !button?.execute)
        throw new Error(
          `[WARNING] The button at ${file} is missing a required "data" or "execute" property.`
        );

      client.buttons.set(button.data.name, button);
    });
  } catch (error) {
    console.log(error);
  }
};
