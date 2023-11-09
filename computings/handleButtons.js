const fs = require("fs");

module.exports = client => {
  // const foldersPath = "./buttons/";
  // const buttonFolders = fs.readdirSync(foldersPath);
  const buttonFiles = fs
    .readdirSync(`./buttons/`)
    .filter(file => file.endsWith(".js"));

  // for (const folder of buttonFolders) {

    for (const file of buttonFiles) {
      const button = require(`../buttons/${file}`);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in button && "execute" in button) {
        client.buttons.set(button.data.name, button);
      } else {
        console.log(
          `[WARNING] The command at ./buttons/ is missing a required "data" or "execute" property.`
        );
      }
    }
  // }
}