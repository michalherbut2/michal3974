const {
  EmbedBuilder,
  AttachmentBuilder,
  BaseInteraction,
  BaseChannel,
  User,
} = require("discord.js");

module.exports = async (
  target,
  {
    title,
    description,
    image,
    thumbnail,
    row,
    footerText,
    color = 0xffc300,
    ephemeral = false,
    followUp = false,
  }
) => {
  console.log("start mebed");

  switch (color) {
    case "red":
      color = 0xf60101;
      break;

    case "green":
      color = 0x248046;
      break;

    default:
      break;
  }

  // create embed
  const embed = new EmbedBuilder().setColor(color).setDescription(description);
  if (title) embed.setTitle(title);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (footerText) embed.setFooter({ text: footerText });

  // create message
  const message = { embeds: [embed], ephemeral };
  if (row) message.components = [row];

  // handle images
  if (image instanceof Array) {
    image.map(i => message.embeds[0].setImage(i));
    console.log(image);
  } else if (image?.startsWith("http")) {
    message.embeds[0].setImage(image);
  } else if (image) {
    const attachment = new AttachmentBuilder(image);
    message.embeds[0].setImage(`attachment://${image.split("/").pop()}`);
    message.files = [attachment];
  }

  // send message
  console.log("\x1b[32m%s\x1b[0m", "sending embed"); // green

  if (target instanceof BaseChannel || target instanceof User)
    return await target.send(message);
  else if (target instanceof BaseInteraction) {
    if (followUp) return await target.followUp(message);
    else return await target.reply(message);
  }

  console.log("\x1b[31m%s\x1b[0m", "The embed has not been sent."); // red
};
