const config = require('../config.json')
const fs = require('fs')

function telegramsend(code, bot, status) {
    var user = config.telegramiduser;
    console.log('Sending message to Telegram')

    if(status == 0) {
        bot.sendPhoto(user, `./screenshots/latestgoldencodeERROR.png`, { caption: `Cos zlego sie stalo i nie udalo nam sie odebrac zlotego kodu!` });
    } else {
        bot.sendPhoto(user, `./screenshots/latestgoldencode.png`, { caption: `**ZLOTY KOD ZOSTAL AKTYWOWANY** \nSprawdz czy kod zostal wykorzystany na screenie!\nKOD: ${code} \n https://key-drop.com/pl/?code=${code} 💥` });
    }
}

module.exports = { telegramsend }