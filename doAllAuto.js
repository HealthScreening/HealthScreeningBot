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
exports.doAllAuto = void 0;
var orm_1 = require("./orm");
var produce_screenshot_1 = require("./produce_screenshot");
function doAllAuto(client, manual) {
    if (manual === void 0) { manual = false; }
    return __awaiter(this, void 0, void 0, function () {
        var items, screenshot, message, user, _i, items_1, item, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, orm_1.Config.findAll()];
                case 1:
                    items = _a.sent();
                    _i = 0, items_1 = items;
                    _a.label = 2;
                case 2:
                    if (!(_i < items_1.length)) return [3 /*break*/, 13];
                    item = items_1[_i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 11, , 12]);
                    return [4 /*yield*/, client.users.fetch(item.userId)];
                case 4:
                    // @ts-ignore
                    user = _a.sent();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 9]);
                    return [4 /*yield*/, (0, produce_screenshot_1.generateScreenshot)(item.firstName, item.lastName, item.email, item.vaccinated)];
                case 6:
                    // @ts-ignore
                    screenshot = _a.sent();
                    return [3 /*break*/, 9];
                case 7:
                    e_1 = _a.sent();
                    return [4 /*yield*/, user.send("The bot had an error while trying to process your health screening. You most likely specified invalid data. Please generate a new health screening using `/generate_once`.")];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 9:
                    if (manual) {
                        // @ts-ignore
                        message = "<@" + item.userId + ">, here's your health screening:\n\n**Note: This was a manually-triggered action, most likely for testing.**";
                    }
                    else {
                        // @ts-ignore
                        message = "<@" + item.userId + ">, here's your health screening:";
                    }
                    // @ts-ignore
                    return [4 /*yield*/, user.send({
                            "content": message,
                            files: [screenshot]
                        })];
                case 10:
                    // @ts-ignore
                    _a.sent();
                    return [3 /*break*/, 12];
                case 11:
                    e_2 = _a.sent();
                    console.error(e_2);
                    return [3 /*break*/, 12];
                case 12:
                    _i++;
                    return [3 /*break*/, 2];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.doAllAuto = doAllAuto;
