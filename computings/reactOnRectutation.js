module.exports = async message => {
  const silageRecruitmentChannel = "1165725038608142439";
  const mainRecruitmentChannel = "1124032855492804681";

  if (
    mainRecruitmentChannel.includes(message.channel.id) ||
    silageRecruitmentChannel.includes(message.channel.id)
  ) {
    await message.react("✅");
    await message.react("❌");
  }
};
