import {GenerateScreenshotParams} from "./produce_screenshot";
import {AdditionalConfig, Config} from "./orm";

export enum GetScreenshotDataReturnType {
    success,
    missingConfig
}

export interface GetScreenshotDataReturn {
    type: GetScreenshotDataReturnType,
    data?: GenerateScreenshotParams
}

export async function getScreenshotData(userId: string): Promise<GetScreenshotDataReturn> {
    const item = await Config.findOne({where: {userId: userId}})
    const additionalItem = await AdditionalConfig.findOne({where: {userId: userId}})
    if (item === null) {
        return {type: GetScreenshotDataReturnType.missingConfig}
    }
    return {
        type: GetScreenshotDataReturnType.success,
        data: {
            // @ts-ignore
            firstName: item.firstName,
            // @ts-ignore
            lastName: item.lastName,
            // @ts-ignore
            email: item.email,
            // @ts-ignore
            isVaxxed: item.vaccinated,
            // @ts-ignore
            deviceName: additionalItem?.device
        }
    }
}