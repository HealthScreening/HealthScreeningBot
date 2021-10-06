import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

export let browser: Browser | null  = null;

export async function generateScreenshot(firstName: string, lastName: string, email: string, isVaxxed: boolean = true, deviceName: string = "iPhone 11"): Promise<Buffer> {
    if (browser === null){
        browser = await puppeteer.launch({headless: true, executablePath: 'chromium-browser'})
    }

    const page = await browser.newPage();
    // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36');
    await page.emulate(puppeteer.devices[deviceName])
    await page.goto('https://healthscreening.schools.nyc/?type=G');
    await page.waitForSelector('#btnDailyScreeningSubmit > button', {visible: true})

    await page.click('label[for="guest_isStudent"]')
    await page.focus("#guest_first_name")
    await page.type("#guest_first_name", firstName)
    await page.focus("#guest_last_name")
    await page.type("#guest_last_name", lastName)
    await page.focus("#guest_email")
    await page.type("#guest_email", email)

    await page.evaluate(() => {
        // @ts-ignore
        document.querySelector("#Location").value = "X445";
    })

    await page.click('#btnDailyScreeningSubmit > button')
    await page.waitForSelector('#q1no', {visible: true})
    await page.click("#q1no")
    await page.waitForSelector('#q2no', {visible: true})
    await page.click("#q2no")

    if (isVaxxed) {
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

    const screenshot = await page.screenshot();
    await page.close()
    // @ts-ignore
    return screenshot

    // await browser.close();
}

/*
(async () => {
    await generateScreenshot("Test", "Ing", "test@ing.com");
})();*/
