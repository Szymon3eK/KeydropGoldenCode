const request = require('request');
var HTMLParser = require('node-html-parser');
const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
const TelegramBot = require('node-telegram-bot-api');

const config = require('../config.json');
const puppeteerENV = require('../puppeteerENV.js')

module.exports = function (telegrambot) {

const {useCode} = require('./useCode.js');

puppeteer.launch(puppeteerENV).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080});
  
    const bypassLocalStorageOverride = (page) => page.evaluateOnNewDocument(() => {
      let __ls = localStorage
      Object.defineProperty(window, 'localStorage', { writable: false, configurable: false, value: __ls })
    })
  
    bypassLocalStorageOverride(page);
  
    await page.goto('https://discord.com/app');
  
    await page.evaluate((token) => {
      localStorage.setItem('token', `"${token}"`);
    }, config.discordtoken);
  
      await page.goto("https://discord.com/channels/862273703709900822/868574854536888401")
      await page.waitForTimeout(5000)

      console.log(browser)

      await page.mouse.move(960, 540);

      await page.waitForTimeout(2000)

      await page.mouse.wheel({ deltaY: 100 });

      await page.waitForTimeout(2000)
  
      const hiddentoken = config.discordtoken.substr(0, 16) + "*".repeat(config.discordtoken.length - 16);
  
      console.log(`Zalogowano do discorda! TOKEN: ${hiddentoken} (sprawdz na screenshocie /screenshots/discordauthtest.png czy login sie udal)`)
      console.log('Pierwsze sprawdzanie powinno sie zaczac za 10 sekund!')
      await page.screenshot({ path: './screenshots/discordauthtest.png' })
  
      telegrambot.sendPhoto(config.telegramiduser, `./screenshots/discordauthtest.png`, { caption: `**URUCHOMIONO SKRYPT** \n\n>> TOKEN: ${hiddentoken}\n\n>> Sprawdz na screenshocie czy skrypt poprawnie sie zalogowal!` });
  
  
      await page.waitForTimeout(3000)
  
      setInterval(async () => {
  
      console.log(`Sprawdzam czy nie ma nowych kodow! (${new Date()})`)
  
      const code = page.evaluate(() => {
        const test = document.querySelectorAll('.markup-eYLPri,messageContent-2t3eCI')
        var text;
  
        test.forEach((div) => {
            text = div.textContent;
        });
  
        return text;
  
  
      }).then((code) => {
        console.log('Najstarszy kod: ' + code)
  
        fs.readFile('latestgoldencode.txt', 'utf8', function(err, data) {
          if(data == code) {
            console.log('nie ma nowego kodu!')
            console.log(" ")
          } else {
            console.log('jest nowy kod!')
            fs.writeFile('latestgoldencode.txt', code, function (err) {
              console.log('Zapisano nowy kod a stary usunieto!');
              console.log(" ")
            });
            useCode(code, telegrambot)
          }
  
        })
      })
    }, 10000)
      
})
}
