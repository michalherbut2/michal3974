const getServerConfig = async db =>
  await db.prepare("SELECT * FROM config").all();

const getConfig = async db =>
  Object.fromEntries(
    (await getServerConfig(db)).map(item => [item.key, item.value])
  );

module.exports = getConfig