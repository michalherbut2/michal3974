const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const Database = require('better-sqlite3');

const SHUTTLE_KEY = 'shuttle-aelrsjnamdxlf0agw2m8';

const db = new Database('settings.db');

// Create the table if it doesn't exist
db.exec(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    model TEXT,
    internet INTEGER
)`);

// Fetch the available options from the ShuttleAI API
let models = [];
axios.get('https://api.shuttleai.app/v1/models', {
    headers: {
        'Authorization': `Bearer ${SHUTTLE_KEY}`
    }
}).then(response => {
    models = response.data;
}).catch(error => {
    console.error(error);
});

// Add other options here

module.exports = {
    data: [
        new SlashCommandBuilder()
            .setName('chat')
            .setDescription('Interact with the GPT-3.5-turbo model in ShuttleAI.')
            .addStringOption(option =>
                option.setName('message')
                    .setDescription('The message to send to the model.')
                    .setRequired(true)),
        new SlashCommandBuilder()
            .setName('image')
            .setDescription('Generate an image from a prompt.')
            .addStringOption(option =>
                option.setName('prompt')
                    .setDescription('The prompt for the image.')
                    .setRequired(true)),
        new SlashCommandBuilder()
            .setName('audio')
            .setDescription('Generate audio from an input.')
            .addStringOption(option =>
                option.setName('input')
                    .setDescription('The input for the audio.')
                    .setRequired(true)),
        new SlashCommandBuilder()
            .setName('transcribe')
            .setDescription('Transcribe audio from a file.')
            .addStringOption(option =>
                option.setName('file')
                    .setDescription('The file to transcribe.')
                    .setRequired(true)),
        new SlashCommandBuilder()
            .setName('moderate')
            .setDescription('Moderate a piece of text.')
            .addStringOption(option =>
                option.setName('input')
                    .setDescription('The text to moderate.')
                    .setRequired(true)),
        new SlashCommandBuilder()
            .setName('embed')
            .setDescription('Generate an embedding from a piece of text.')
            .addStringOption(option =>
                option.setName('input')
                    .setDescription('The text to generate an embedding from.')
                    .setRequired(true)),
        new SlashCommandBuilder()
            .setName('ustawienia_ai')
            .setDescription('Configure the AI settings.')
            .addStringOption(option =>
                option.setName('model')
                    .setDescription('The model to use.')
                    .addChoices(models.map(model => [model, model])) // Add the models as choices
                    .setRequired(true))
            .addBooleanOption(option =>
                option.setName('internet')
                    .setDescription('Whether the AI should use the internet.')
                    .addChoices([
                        ['Yes', true],
                        ['No', false]
                    ])
                    .setRequired(true))
    ],
    async execute(interaction) {
        const command = interaction.commandName;

        // Get the user's settings from the database
        let stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        let settings = stmt.get(interaction.user.id);

        if (command === 'chat') {
            let message = interaction.options.getString('message');
            let response = await axios.post('https://api.shuttleai.app/v1/chat/completions', {
                model: settings.model,
                messages: [{"role":"system","content":`You are a helpful assistant.`},{"role":"user","content":message}],
                stream: false,
                plain: false,
                internet: settings.internet
            }, {
                headers: {
                    'Authorization': `Bearer ${SHUTTLE_KEY}`
                }
            });
            await interaction.reply(response.data.choices[0].message.content);
        } else if (command === 'image') {
            let prompt = interaction.options.getString('prompt');
            let response = await axios.post('https://api.shuttleai.app/v1/images/generations', {
                model: 'sdxl',
                prompt: prompt,
                n: 1,
            }, {
                headers: {
                    'Authorization': `Bearer ${SHUTTLE_KEY}`
                }
            });
            await interaction.reply(response.data);
        } else if (command === 'audio') {
            let input = interaction.options.getString('input');
            let response = await axios.post('https://api.shuttleai.app/v1/audio/generations', {
                model: 'eleven-labs-999',
                input: input,
                voice: "mimi"
            }, {
                headers: {
                    'Authorization': `Bearer ${SHUTTLE_KEY}`
                }
            });
            await interaction.reply(response.data);
        } else if (command === 'transcribe') {
            let file = interaction.options.getString('file');
            let response = await axios.post('https://api.shuttleai.app/v1/audio/transcriptions', {
                model: 'whisper-large',
                file: file
            }, {
                headers: {
                    'Authorization': `Bearer ${SHUTTLE_KEY}`
                }
            });
            await interaction.reply(response.data);
        } else if (command === 'moderate') {
            let input = interaction.options.getString('input');
            let response = await axios.post('https://api.shuttleai.app/v1/moderations', {
                model: 'text-moderation-007',
                input: input
            }, {
                headers: {
                    'Authorization': `Bearer ${SHUTTLE_KEY}`
                }
            });
            await interaction.reply(response.data);
        } else if (command === 'embed') {
            let input = interaction.options.getString('input');
            let response = await axios.post('https://api.shuttleai.app/v1/embeddings', {
                model: 'text-embedding-ada-002',
                input: input
            }, {
                headers: {
                    'Authorization': `Bearer ${SHUTTLE_KEY}`
                }
            });
            await interaction.reply(response.data);
        } else if (command === 'ustawienia_ai') {
            let model = interaction.options.getString('model');
            let internet = interaction.options.getBoolean('internet');

            // Save the settings to the database
            stmt = db.prepare('INSERT OR REPLACE INTO users (id, model, internet) VALUES (?, ?, ?)');
            stmt.run(interaction.user.id, model, internet);

            await interaction.reply(`Ustawienia AI zostały zaktualizowane. Model: ${model}, Internet: ${internet}`);
        }
    },
};
