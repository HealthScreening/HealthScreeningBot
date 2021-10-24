import {Client, Collection, DiscordAPIError, GuildMember, Intents, Message} from "discord.js";
import {DateTime} from "luxon";
import { usedRecently } from "./commands/generateAuto";
import {doAllAuto} from "./doAllAuto"
import {Config, init} from "./orm"
import {generateScreenshot as produceScreenshot, GenerateScreenshotSendableTypeType} from "./produce_screenshot";

const {discord} = require("./config.json");
const fs = require('fs');

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS)
myIntents.add(Intents.FLAGS.GUILD_MEMBERS)
myIntents.add(Intents.FLAGS.GUILD_MESSAGES)
myIntents.add(Intents.FLAGS.DIRECT_MESSAGES)

const client = new Client({
    intents: myIntents,
});

client["commands"] = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client["commands"].set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isCommand()) return;

        console.debug("%s%s ran %s", interaction.user.username, interaction.user.discriminator, interaction.commandName);

        const command = client["commands"].get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            }
        }
    } catch (e) {
        console.error(e);
    }
});

// When the client is ready, run this code (only once)

function do6AMLoop1() {
    try {
        let sixAMTime: DateTime;
        const currentTime = DateTime.local({locale: "en_US", zone: "America/New_York"})
        if (currentTime.hour > 5 || (currentTime.hour === 5 && currentTime.minute >= 40)) {
            sixAMTime = currentTime.plus({days: 1})
            sixAMTime = DateTime.local(sixAMTime.year, sixAMTime.month, sixAMTime.day, 5, 40, 0, {
                locale: "en_US",
                zone: "America/New_York"
            })
        } else {
            sixAMTime = DateTime.local(currentTime.year, currentTime.month, currentTime.day, 5, 40, 0, {
                locale: "en_US",
                zone: "America/New_York"
            })
        }
        const timeToSleep = sixAMTime.diff(currentTime, "milliseconds")
        setTimeout(do6AMLoop2, timeToSleep.milliseconds)
    } catch (e) {
        console.error(e)
    }
}

function do6AMLoop2() {
    try {
        const currentTime = DateTime.local({locale: "en_US", zone: "America/New_York"})
        if (!(currentTime.weekday == 6 || currentTime.weekday == 7)) {
            doAllAuto(client).catch((reason => console.error(reason)))
        }
        setTimeout(do6AMLoop1, 1000);
    } catch (e) {
        console.error(e)
    }
}

async function assignAutoSchoolRole() {
    const data = {
        "bxscience.edu": "893918744437456916",
        "bths.edu": "893918912188661850",
        "stuy.edu": "893918994216681473"
    }
    const items = await Config.findAll()
    const guild = client.guilds.cache.get("889983763994521610");
    let suffix: string, roleId: string, member: GuildMember;
    for (const item of items) {
        for (const suffix_data of Object.entries(data)) {
            suffix = suffix_data[0];
            roleId = suffix_data[1];
            // @ts-ignore
            if (item.email.endsWith(suffix)) {
                try {
                    // @ts-ignore
                    member = await guild.members.fetch(item.userId)
                } catch (e) {
                    if (e instanceof DiscordAPIError) {
                        continue
                    }
                    console.error(e)
                }
                try {
                    await member.roles.add(roleId, "Autorole on email in storage")
                } catch (e) {
                    console.error(e)
                }
            }
        }
    }
}

client.once('ready', () => {
    assignAutoSchoolRole().catch(function (reason) {
        console.error(reason)
    })
    try {
        do6AMLoop1();
    } catch (e) {
        console.error(e)
    }
});

const GENERATE_AUTO_CHOICES = ["hsb/generateauto", "hsb/generate-auto", "hsb/generate_auto"]

client.on('message', async (message: Message) => {
    if (message.content && message.content.substring(0, 2) === "hsb/") {
        if (GENERATE_AUTO_CHOICES.includes(message.content.replace(/\s+/g, ""))) {
            const item = await Config.findOne({where: {userId: message.author.id}})
            if (item === null) {
                await message.channel.send({
                    content: message.author.toString() + ", you do not have any auto information stored! Use `/set_auto` to set some information.",
                    reply: {messageReference: message, failIfNotExists: false}
                })
                return
            }
            await message.channel.sendTyping()
            await produceScreenshot({
                // @ts-ignore
                firstName: item.firstName,
                // @ts-ignore
                lastName: item.lastName,
                // @ts-ignore
                email: item.email,
                // @ts-ignore
                isVaxxed: item.vaccinated,
                sendable: {type: GenerateScreenshotSendableTypeType.message, message},
                cooldownSet: {set: usedRecently, item: message.author.id}
            });
        }
    }
})

// Login to Discord with your client's token
init().then(function () {
    client.login(discord.token);
})