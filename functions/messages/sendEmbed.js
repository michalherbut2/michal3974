const {
  EmbedBuilder,
  AttachmentBuilder,
  BaseInteraction,
  BaseChannel,
  User,
  GuildMember,
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
  try {
    // Map color names to hex values
    const colorMap = {
      red: 0xf60101,
      green: 0x248046,
      "light green": 0x90ee90,
      "intense green": 0x41fd02,
      tiktok: 0x00f2ea,
      youtube: 0xdd2c28,
      instagram: 0x794eba,
    };

    // Get the color from the map if it's a string
    if (typeof color === "string" && colorMap[color.toLowerCase()]) {
      color = colorMap[color.toLowerCase()];
    }

    // Check description
    if (!description) {
      description = "[błąd] pusty opis, zgłoś to do Szanownego Patryka";
    }

    // Create an embed
    const embed = new EmbedBuilder().setColor(color).setDescription(description);
    if (title) embed.setTitle(title);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (footerText) embed.setFooter({ text: footerText });

    // Create a message
    const message = { embeds: [embed], ephemeral };
    if (row) message.components = [row];
    if (content) message.content = content;

    // Handle images
    if (Array.isArray(image)) {
      image.forEach((img) => embed.setImage(img));
    } else if (typeof image === "string" && image.startsWith("http")) {
      embed.setImage(image);
    } else if (image) {
      const attachment = new AttachmentBuilder(image);
      embed.setImage(`attachment://${image.split("/").pop()}`);
      message.files = [attachment];
    }

    // Send the message
    console.log("\x1b[32m%s\x1b[0m", "Sending embed."); // green
    if (
      target instanceof BaseChannel ||
      target instanceof User ||
      target instanceof GuildMember
    ) {
      // Send to the channel or user
      return await target.send(message);
    } else if (target instanceof BaseInteraction) {
      // Follow up or reply
      if (followUp || target.replied || target.deferred) {
        return await target.followUp(message);
      } else {
        return await target.reply(message);
      }
    } else {
      throw new Error("Invalid target type.");
    }
  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `The embed has not been sent to ${
        target?.name || target?.displayName
      }.\n${error}`
    ); // red
  }
};