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
var discord_js_1 = require("discord.js");
var luxon_1 = require("luxon");
var doAllAuto_1 = require("./doAllAuto");
var orm_1 = require("./orm");
var discord = require("./config.json").discord;
var fs = require('fs');
var myIntents = new discord_js_1.Intents();
myIntents.add(discord_js_1.Intents.FLAGS.GUILDS);
myIntents.add(discord_js_1.Intents.FLAGS.GUILD_MEMBERS);
var client = new discord_js_1.Client({
    intents: myIntents,
});
client["commands"] = new discord_js_1.Collection();
var commandFiles = fs.readdirSync('./commands').filter(function (file) { return file.endsWith('.js'); });
for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
    var file = commandFiles_1[_i];
    var command = require("./commands/" + file);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client["commands"].set(command.data.name, command);
}
client.on('interactionCreate', function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var command, error_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                if (!interaction.isCommand())
                    return [2 /*return*/];
                console.debug("%s%s ran %s", interaction.user.username, interaction.user.discriminator, interaction.commandName);
                command = client["commands"].get(interaction.commandName);
                if (!command)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 8]);
                return [4 /*yield*/, command.execute(interaction)];
            case 2:
                _a.sent();
                return [3 /*break*/, 8];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                if (!interaction.deferred) return [3 /*break*/, 5];
                return [4 /*yield*/, interaction.followUp({
                        content: 'There was an error while executing this command!',
                        ephemeral: true
                    })];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 10];
            case 9:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// When the client is ready, run this code (only once)
function do6AMLoop1() {
    try {
        var sixAMTime = void 0;
        var currentTime = luxon_1.DateTime.local({ locale: "en_US", zone: "America/New_York" });
        if (currentTime.hour > 5 || (currentTime.hour === 5 && currentTime.minute >= 40)) {
            sixAMTime = currentTime.plus({ days: 1 });
            sixAMTime = luxon_1.DateTime.local(sixAMTime.year, sixAMTime.month, sixAMTime.day, 5, 40, 0, {
                locale: "en_US",
                zone: "America/New_York"
            });
        }
        else {
            sixAMTime = luxon_1.DateTime.local(currentTime.year, currentTime.month, currentTime.day, 5, 40, 0, {
                locale: "en_US",
                zone: "America/New_York"
            });
        }
        var timeToSleep = sixAMTime.diff(currentTime, "milliseconds");
        setTimeout(do6AMLoop2, timeToSleep.milliseconds);
    }
    catch (e) {
        console.error(e);
    }
}
function do6AMLoop2() {
    try {
        var currentTime = luxon_1.DateTime.local({ locale: "en_US", zone: "America/New_York" });
        if (!(currentTime.weekday == 6 || currentTime.weekday == 7)) {
            (0, doAllAuto_1.doAllAuto)(client)["catch"]((function (reason) { return console.error(reason); }));
        }
        setTimeout(do6AMLoop1, 1000);
    }
    catch (e) {
        console.error(e);
    }
}
function assignAutoSchoolRole() {
    return __awaiter(this, void 0, void 0, function () {
        var data, items, guild, suffix, roleId, member, _i, items_1, item, _a, _b, suffix_data, e_2, e_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    data = {
                        "bxscience.edu": "893918744437456916",
                        "bths.edu": "893918912188661850",
                        "stuy.edu": "893918994216681473"
                    };
                    return [4 /*yield*/, orm_1.Config.findAll()];
                case 1:
                    items = _c.sent();
                    guild = client.guilds.cache.get("889983763994521610");
                    _i = 0, items_1 = items;
                    _c.label = 2;
                case 2:
                    if (!(_i < items_1.length)) return [3 /*break*/, 12];
                    item = items_1[_i];
                    _a = 0, _b = Object.entries(data);
                    _c.label = 3;
                case 3:
                    if (!(_a < _b.length)) return [3 /*break*/, 11];
                    suffix_data = _b[_a];
                    suffix = suffix_data[0];
                    roleId = suffix_data[1];
                    if (!item.email.endsWith(suffix)) return [3 /*break*/, 10];
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, guild.members.fetch(item.userId)];
                case 5:
                    // @ts-ignore
                    member = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _c.sent();
                    if (e_2 instanceof discord_js_1.DiscordAPIError) {
                        return [3 /*break*/, 10];
                    }
                    console.error(e_2);
                    return [3 /*break*/, 7];
                case 7:
                    _c.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, member.roles.add(roleId, "Autorole on email in storage")];
                case 8:
                    _c.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_3 = _c.sent();
                    console.error(e_3);
                    return [3 /*break*/, 10];
                case 10:
                    _a++;
                    return [3 /*break*/, 3];
                case 11:
                    _i++;
                    return [3 /*break*/, 2];
                case 12: return [2 /*return*/];
            }
        });
    });
}
client.once('ready', function () {
    assignAutoSchoolRole()["catch"](function (reason) {
        console.error(reason);
    });
    try {
        do6AMLoop1();
    }
    catch (e) {
        console.error(e);
    }
});
// Login to Discord with your client's token
(0, orm_1.init)().then(function () {
    client.login(discord.token);
});
