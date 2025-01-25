const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { AttachmentBuilder } = require("discord.js");
const { request } = require('undici');

module.exports = async (auditLog, guild) => {
  try {
    // Define your variables.
    const { executor, target, reason } = auditLog;

    if (!executor || !target) {
      throw new Error("Invalid audit log data.");
    }

    const canvas = createCanvas(890, 500);
    const ctx = canvas.getContext("2d");

    const backgroundColor = "#2d2d2d";
    const rectangleColor = "#121212";

    const horizontalPadding = 33;
    const verticalPadding = 52;
    const roundSize = 15;

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw rectangle
    ctx.fillStyle = rectangleColor;
    ctx.beginPath();
    ctx.roundRect(
      horizontalPadding,
      verticalPadding,
      canvas.width - horizontalPadding * 2,
      canvas.height - verticalPadding * 2,
      [roundSize, roundSize, roundSize, roundSize]
    );
    ctx.fill();

    // Draw header
    ctx.font = "Bold 46px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Zbanowano nowego użytkownika", canvas.width / 2, 120);

    // Draw user avatar
    const { body } = await request(target.displayAvatarURL({ extension: 'jpg' }));
    const avatar = await loadImage(await body.arrayBuffer());

    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2 - 110, 220, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, canvas.width / 2 - 170, 160, 120, 120);
    ctx.restore();

    // Draw user name
    ctx.font = applyText(canvas, target.tag);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(target.tag, canvas.width / 2 - 20, canvas.height / 2 - 10);

    // Draw ban reason
    ctx.font = "27px Arial";
    ctx.fillStyle = "#aaa";
    ctx.textAlign = "center";
    ctx.fillText(reason || "Za darmo", canvas.width / 2, 340);

    // Draw moderator
    ctx.font = "italic bold 18px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Przez: " + executor.tag, canvas.width / 2, 410);

    // Create and send attachment
    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "ban-image.png",
    });

    const channel = guild.channels.cache.find(ch => ch.name.includes("bany"));
    if (channel) {
      await channel.send({ files: [attachment] });
    } else {
      console.error("Ban channel not found.");
    }
  } catch (error) {
    console.error("Error creating ban image:", error);
  }
};

const applyText = (canvas, text) => {
  const ctx = canvas.getContext('2d');
  let fontSize = 70;

  do {
    ctx.font = `bold ${fontSize -= 10}px Arial`;
  } while (ctx.measureText(text).width > canvas.width / 2 - 100);

  return ctx.font;
};