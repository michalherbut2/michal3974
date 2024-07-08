const sendEmbed = require("../functions/messages/sendEmbed");

module.exports = {
  name: "embed",

  async execute(interaction) {
    const { fields } = interaction;

    const title = fields.getTextInputValue("title");
    const description = fields.getTextInputValue("description");

    await sendEmbed(interaction, {
      title,
      description,
    });
  },
};
