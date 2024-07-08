// at the top of your file
const { EmbedBuilder } = require("discord.js");

const image =
  "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS3FweCY-fXGzKZ07-P-PhVZqzpe59ABNS2uE27KztZ1Cjo493Q";



const createEmbed= (title, description, color = 0x0099ff) => {
  // inside a command, event listener, etc.
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setURL("https://youtube.com/@jura3")
    .setAuthor({
      name: "Stary w śpiworze",
      iconURL: image,
      url: "https://youtube.com/@jura3",
    })
    .setThumbnail(image);
  // .addFields(
  //   // ...body
  //   // { name: "Regular field title", value: "Some value here" },
  //   // { name: "\u200B", value: "\u200B" },
  //   // { name: "Inline field title", value: "Some value here", inline: true },
  //   // { name: "Inline field title", value: "Some value here", inline: true }
  // )
  // .setImage(image)
  // .addFields({
  //   name: "Inline field title",
  //   value: "Some value here",
  //   inline: true,
  // })
  // .setTimestamp()
  // .setFooter({
  //   text: "Stary w śpiworze pozdrawia",
  //   iconURL: image,
  // });
};
const createSimpleEmbed = description =>
  new EmbedBuilder().setColor(0x0099ff).setDescription(description);

const createWarningEmbed = description =>
  new EmbedBuilder().setColor(0xff0000).setDescription(description);

const createSuccessEmbed = description =>
  new EmbedBuilder().setColor(0x3ba55c).setDescription(description);

const replyEmbed = async (interaction, title, description) =>
  await interaction.reply({
    embeds: [createEmbed(title, description)],
  });

const replySimpleEmbed = async (interaction, description) =>
  await interaction.reply({
    embeds: [createSimpleEmbed(description)],
  });

const replyWarningEmbed = async (interaction, description) =>
  await interaction.reply({
    embeds: [createWarningEmbed(description)],
  });

  module.exports = {
    // createEmbed: (title, description, color = 0x0099ff) => {
    //   // inside a command, event listener, etc.
    //   return new EmbedBuilder()
    //     .setColor(color)
    //     .setTitle(title)
    //     .setDescription(description)
    //     .setURL("https://youtube.com/@jura3")
    //     .setAuthor({
    //       name: "Stary w śpiworze",
    //       iconURL: image,
    //       url: "https://youtube.com/@jura3",
    //     })
    //     .setThumbnail(image);
    //   // .addFields(
    //   //   // ...body
    //   //   // { name: "Regular field title", value: "Some value here" },
    //   //   // { name: "\u200B", value: "\u200B" },
    //   //   // { name: "Inline field title", value: "Some value here", inline: true },
    //   //   // { name: "Inline field title", value: "Some value here", inline: true }
    //   // )
    //   // .setImage(image)
    //   // .addFields({
    //   //   name: "Inline field title",
    //   //   value: "Some value here",
    //   //   inline: true,
    //   // })
    //   // .setTimestamp()
    //   // .setFooter({
    //   //   text: "Stary w śpiworze pozdrawia",
    //   //   iconURL: image,
    //   // });
    // },
    // createSimpleEmbed: description =>
    //   new EmbedBuilder().setColor(0x0099ff).setDescription(description),
    // createWarningEmbed: description =>
    //   new EmbedBuilder().setColor(0xff0000).setDescription(description),
    // createSuccessEmbed: description =>
    //   new EmbedBuilder().setColor(0x3ba55c).setDescription(description),
    // replyEmbed (interaction, title, description) {
    //   console.log(this);
    //   interaction.reply({
    //     embeds: [this.createEmbed(title, description)],
    //   })},
    // replySimpleEmbed: (interaction, description) =>
    //   interaction.reply({
    //     embeds: [this.createSimpleEmbed(description)],
    //   }),
    // replyWarningEmbed: (interaction, description) =>
    //   interaction.reply({
    //     embeds: [this.createWarningEmbed(description)],
    //   }),
    createEmbed,
  createSimpleEmbed,
  createWarningEmbed,
  createSuccessEmbed,
  replyEmbed,
  replySimpleEmbed,
  replyWarningEmbed,
  };