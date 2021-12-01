import * as Buffer from "buffer";

import {Browser, devices, launch} from 'puppeteer';

export let browser: Browser | null = null;

export interface GenerateScreenshotParams {
    firstName: string;
    lastName: string;
    email: string;
    isVaxxed: boolean;
    deviceName?: string;
}

export async function generateScreenshot(options: GenerateScreenshotParams): Promise<Buffer> {
    // We assume the browser has been started already.

    let screenshot: Buffer | null = null;

    const page = await browser.newPage();
    try {

        await page.emulate(devices[options.deviceName || "iPhone 11"])
        await page.goto('https://healthscreening.schools.nyc/?type=G');
        await page.waitForSelector('#btnDailyScreeningSubmit > button', {visible: true})

        await page.click('label[for="guest_isStudent"]')
        await page.focus("#guest_first_name")
        await page.type("#guest_first_name", options.firstName)
        await page.focus("#guest_last_name")
        await page.type("#guest_last_name", options.lastName)
        await page.focus("#guest_email")
        await page.type("#guest_email", options.email)

        await page.evaluate(() => {
            document.querySelector<HTMLInputElement>("#Location").value = "X445";
        })

        await page.click('#btnDailyScreeningSubmit > button')
        await page.waitForSelector('#q1no', {visible: true})
        await page.click("#q1no")
        await page.waitForSelector('#q2no', {visible: true})
        await page.click("#q2no")

        if (options.isVaxxed) {
            await page.waitForSelector('#q3yes', {visible: true})
            await page.click("#q3yes")
        } else {
            await page.waitForSelector('#q3yes1', {visible: true})
            await page.click("#q3yes1")
            await page.waitForSelector('#q4no', {visible: true})
            await page.click("#q4no")
        }
        await page.waitForSelector('div.question-submit > div.text-center > button.btn-primary', {visible: true})


        await page.click('div.question-submit > div.text-center > button.btn-primary');
        await page.waitForSelector("#guest_badges_content > div");

        await page.waitForSelector("#guest_badges .card-body svg", {visible: true})

        await page.evaluate(() => {
            window.scrollBy(0, -10000);
        })
        // @ts-ignore
        screenshot = await page.screenshot();
    } finally {
        await page.close()
    }
    if (screenshot === null) {
        throw new Error("Screenshot was null.")
    } else {
        return screenshot;
    }
}

export async function startupBrowser(){
    if (browser === null) {
        browser = await launch({headless: true, executablePath: 'chromium-browser'})
    }
}