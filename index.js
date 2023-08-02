const request = require('request');
var HTMLParser = require('node-html-parser');
const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const csvdb = require('csv-database')

const config = require('./config.json');

const {telegramsend} = require('./functions/telegramNotify.js')
const {useCode} = require('./functions/useCode.js')
const {getGoldenCards} = require('./functions/getGoldenCards.js')


const Discord = require('discord.js');
const { timeStamp } = require('console');
const client = new Discord.Client();

puppeteer.use(StealthPlugin())

const telegrambot = new TelegramBot(config.telegramsecret, {polling: true});

const discordGetCode = require('./functions/discordGetCodes.js')(telegrambot)

const puppeteerENV = require('./puppeteerENV.js')



cron.schedule('0 3 * * *', () => {
  getGoldenCards(telegrambot);
});

const {infoCommand} = require('./commands/info.js')
const {idCommand} = require('./commands/id.js')


telegrambot.onText(/\/id/, (msg, match) => {idCommand(telegrambot, msg, match)});
telegrambot.onText(/\/info/, (msg, match) => {infoCommand(telegrambot, msg, match)});


