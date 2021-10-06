"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.generateScreenshot = exports.browser = void 0;
var puppeteer = require("puppeteer");
exports.browser = null;
function generateScreenshot(firstName, lastName, email, isVaxxed, deviceName) {
    if (isVaxxed === void 0) { isVaxxed = true; }
    if (deviceName === void 0) { deviceName = "iPhone 11"; }
    return __awaiter(this, void 0, void 0, function () {
        var page, screenshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(exports.browser === null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, puppeteer.launch({ headless: true, executablePath: 'chromium-browser' })];
                case 1:
                    exports.browser = _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, exports.browser.newPage()];
                case 3:
                    page = _a.sent();
                    // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36');
                    return [4 /*yield*/, page.emulate(puppeteer.devices[deviceName])];
                case 4:
                    // await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36');
                    _a.sent();
                    return [4 /*yield*/, page.goto('https://healthscreening.schools.nyc/?type=G')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector('#btnDailyScreeningSubmit > button', { visible: true })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page.click('label[for="guest_isStudent"]')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, page.focus("#guest_first_name")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, page.type("#guest_first_name", firstName)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, page.focus("#guest_last_name")];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, page.type("#guest_last_name", lastName)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, page.focus("#guest_email")];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, page.type("#guest_email", email)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function () {
                            // @ts-ignore
                            document.querySelector("#Location").value = "X445";
                        })];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, page.click('#btnDailyScreeningSubmit > button')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector('#q1no', { visible: true })];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, page.click("#q1no")];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector('#q2no', { visible: true })];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, page.click("#q2no")];
                case 19:
                    _a.sent();
                    if (!isVaxxed) return [3 /*break*/, 22];
                    return [4 /*yield*/, page.waitForSelector('#q3yes', { visible: true })];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, page.click("#q3yes")];
                case 21:
                    _a.sent();
                    return [3 /*break*/, 27];
                case 22: return [4 /*yield*/, page.waitForSelector('#q3yes1', { visible: true })];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, page.click("#q3yes1")];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector('#q4no', { visible: true })];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, page.click("#q4no")];
                case 26:
                    _a.sent();
                    _a.label = 27;
                case 27: return [4 /*yield*/, page.waitForSelector('div.question-submit > div.text-center > button.btn-primary', { visible: true })];
                case 28:
                    _a.sent();
                    return [4 /*yield*/, page.click('div.question-submit > div.text-center > button.btn-primary')];
                case 29:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector("#guest_badges_content > div")];
                case 30:
                    _a.sent();
                    return [4 /*yield*/, page.waitForSelector("#guest_badges .card-body svg", { visible: true })];
                case 31:
                    _a.sent();
                    return [4 /*yield*/, page.screenshot()];
                case 32:
                    screenshot = _a.sent();
                    return [4 /*yield*/, page.close()
                        // @ts-ignore
                    ];
                case 33:
                    _a.sent();
                    // @ts-ignore
                    return [2 /*return*/, screenshot
                        // await browser.close();
                    ];
            }
        });
    });
}
exports.generateScreenshot = generateScreenshot;
/*
(async () => {
    await generateScreenshot("Test", "Ing", "test@ing.com");
})();*/
