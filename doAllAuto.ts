import {Client, User} from "discord.js"
import {Config} from "./orm"

import {generateScreenshot as produceScreenshot} from "./produce_screenshot"

export async function doAllAuto(client: Client, manual: boolean = false) {
    const items = await Config.findAll()
    let screenshot, message, user: User;
    for (const item of items) {
        try {
            // @ts-ignore
            user = await client.users.fetch(item.userId);
            try {
                // @ts-ignore
                screenshot = await produceScreenshot(item.firstName, item.lastName, item.email, item.vaccinated);
            } catch (e) {
                await user.send("The bot had an error while trying to process your health screening. You most likely specified invalid data. Please generate a new health screening using `/generate_once`.")
            }
            if (manual) {
                // @ts-ignore
                message = `<@${item.userId}>, here's your health screening:\n\n**Note: This was a manually-triggered action, most likely for testing.**`
            } else {
                // @ts-ignore
                message = `<@${item.userId}>, here's your health screening:`
            }
            // @ts-ignore
            await user.send({
                "content": message,
                files: [screenshot]
            })
        } catch (e) {
            console.error(e)
        }
    }
}