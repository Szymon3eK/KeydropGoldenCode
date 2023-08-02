const puppeteer = require('puppeteer-extra');
const fs = require('fs');

const config = require('../config.json');

function idCommand(telegrambot, msg, match) {
    telegrambot.sendMessage(config.telegramiduser, 'Twoje telegram ID to: ' + msg.chat.id);
}

module.exports = {
    idCommand,
  };
