import {Client, Collection, DiscordAPIError, GuildMember, Intents, Message} from "discord.js";
import {DateTime} from "luxon";
import {doAllAuto} from "./doAllAuto"
import {Config, init} from "./orm";

const {discord} = require("../config.json");
const fs = require('fs');

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS)
myIntents.add(Intents.FLAGS.GUILD_MEMBERS)
myIntents.add(Intents.FLAGS.GUILD_MESSAGES)
myIntents.add(Intents.FLAGS.DIRECT_MESSAGES)

const client: Client = new Client({
    intents: myIntents,
    partials: ['CHANNEL'],
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


// Login to Discord with your client's token
init().then(function () {
    client.login(discord.token);
})