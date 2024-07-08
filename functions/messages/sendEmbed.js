const { GuildMember } = require("discord.js");
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
    content,
    image,
    thumbnail,
    row,
    footerText,
    color = 0x0099ff,
    ephemeral = false,
    followUp = false,
  }
) => {
  // get a color
  switch (color) {
    case "red":
      color = 0xf60101;
      break;

    case "green":
      color = 0x248046;
      break;

    case "light green":
      color = 0x90ee90;
      break;

    case "intense green":
      color = 0x41fd02;
      break;

    case "tiktok":
      color = 0x00f2ea;
      break;

    case "youtube":
      color = 0xdd2c28;
      break;

    case "instagram":
      color = 0x794eba;
      break;
  }

  // create an embed
  const embed = new EmbedBuilder().setColor(color).setDescription(description);
  if (title) embed.setTitle(title);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (footerText) embed.setFooter({ text: footerText });

  // create a message
  const message = { embeds: [embed], ephemeral };
  if (row) message.components = [row];
  if (content) message.content = content;

  // handle an images
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

  // send the message
  console.log("\x1b[32m%s\x1b[0m", "Sending embed."); // green
  try {
    if (
      target instanceof BaseChannel ||
      target instanceof User ||
      target instanceof GuildMember
    )
      // send to the channel or user
      return await target.send(message);
    else if (target instanceof BaseInteraction) {
      // follow up
      if (followUp || target.replied || target.deferred)
        return await target.followUp(message);
      // reply
      else return await target.reply(message);
    }
  } catch (error) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `The embed has not been sent to the ${
        target?.name || target?.displayName
      }.\n${error.message}`
    ); // red
  }
};
