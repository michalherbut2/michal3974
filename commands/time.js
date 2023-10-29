module.exports = {
    config: {
        name: "gra",
        description: "Returns players list",
        usage: `gra`,
    },
    run: (client) => { }
}
// const db = new sqlite3.Database('./user_activity.db');

// function checkInactivity() {
//     const guild = client.guilds.cache.get(GUILD_ID);

//     if (!guild) {
//         console.error('Serwer nie został znaleziony.');
//         return;
//     }

//     const role = guild.roles.cache.get(ROLE_ID);

//     if (!role) {
//         console.error('Rola nie została znaleziona.');
//         return;
//     }

//     const dayInMilliseconds = 24 * 60 * 60 * 1000; // Dzień w milisekundach

//     setInterval(() => {
//         guild.members.fetch().then((members) => {
//             members.forEach((member) => {
//                 if (!member.voice.channel) {
//                     const lastActiveTime = Date.now() - member.joinedAt;
//                     if (lastActiveTime >= dayInMilliseconds) {
//                         member.roles.remove(role)
//                             .then(() => console.log(Usunięto rolę ${role.name} od użytkownika ${member.user.tag}.))
//                             .catch(console.error);
//                     }
//                 }
//             });
//         });
//     }, dayInMilliseconds); // Sprawdzaj codziennie
// }