module.exports = async (message) => {
  try {
    const silageRecruitmentChannel = "1165725038608142439";
    const mainRecruitmentChannel = "1124032855492804681";

    // Check if the message was sent in one of the recruitment channels
    if (
      message.channel.id === mainRecruitmentChannel ||
      message.channel.id === silageRecruitmentChannel
    ) {
      // React to the message with ✅ and ❌
      await message.react("✅");
      await message.react("❌");
    }
  } catch (error) {
    console.error("Error reacting to message:", error);
  }
};