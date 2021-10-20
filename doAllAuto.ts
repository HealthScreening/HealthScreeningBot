import {Client, User} from "discord.js"
import {Config} from "./orm"

import {
    generateScreenshot as produceScreenshot,
    GenerateScreenshotSendableTypeType,
    semaphore
} from "./produce_screenshot"

async function actOnItem(client, item, manual){
    try {
        // @ts-ignore
        const user: User = await client.users.fetch(item.userId);
        if (manual){
            await user.send("**The auto health screening has been *manually triggered* by the bot owner, most likely for testing.**")
        }
        try {
            // @ts-ignore
            return await produceScreenshot({firstName : item.firstName, lastName : item.lastName, email : item.email, isVaxxed : item.vaccinated, sendable: {type: GenerateScreenshotSendableTypeType.user, user: user}});
        } catch (e) {
            await user.send("The bot had an error while trying to process your health screening. You most likely specified invalid data. Please generate a new health screening using `/generate_once`.")
        }
    } catch (e) {
        console.error(e)
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function doAllAuto(client: Client, manual: boolean = false) {
    const items = await Config.findAll()
    let toDo = []
    for (const item of items) {
        toDo.push(item)
        if (toDo.length === 1){
            while (semaphore.isLocked()){
                await sleep(1000);
            }
            await Promise.all(toDo.map((value => actOnItem(client, value, manual))))
            toDo = []
        }
    }
}