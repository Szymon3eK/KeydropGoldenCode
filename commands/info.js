const puppeteer = require('puppeteer-extra');
const fs = require('fs');

const config = require('../config.json');
const puppeteerENV = require('../puppeteerENV.js')

function infoCommand(telegrambot, msg, match) {
    const chatId = msg.chat.id;

    if(chatId != config.telegramiduser) return bot.sendMessage(chatId, 'Nie masz dostepu do tego bota!');
  
    telegrambot.sendMessage(config.telegramiduser, 'juz sprwadzam twoje saldo!');
  
    puppeteer.launch(puppeteerENV).then(async browser => {
      const page = await browser.newPage();
  
      const cookies = JSON.parse(fs.readFileSync('./cookies/keydrop.json', 'utf8'));
      await page.setCookie(...cookies);
  
      await page.setJavaScriptEnabled(true);
      await page.setViewport({ width: 2560, height: 1440 });
  
      await page.goto(`https://key-drop.com/pl/panel/profil`);
  
      await page.waitForTimeout(5000)
  
      var waluty = await page.evaluate(() => {
        try {
          var pieniadze = document.querySelector("#header-root > header > div.flex.h-\\[4\\.125rem\\].items-center.bg-navy-700.md\\:mb-3.md\\:h-\\[5\\.625rem\\] > div.flex.self-stretch.rounded-l-2xl.md\\:bg-navy-800\\/80.order-5.ml-auto > div.hidden.items-center.gap-x-3.pl-3.lg\\:flex.lg\\:pl-5 > div > div:nth-child(1) > div:nth-child(2) > p.text-xs.font-bold.tabular-nums.text-lightgreen.lg\\:text-sm > span")
          var wartoscskinow = document.querySelector("#header-root > header > div.flex.h-\\[4\\.125rem\\].items-center.bg-navy-700.md\\:mb-3.md\\:h-\\[5\\.625rem\\] > div.flex.self-stretch.rounded-l-2xl.md\\:bg-navy-800\\/80.order-5.ml-auto > div.hidden.items-center.gap-x-3.pl-3.lg\\:flex.lg\\:pl-5 > div > div.flex.h-full.items-center.gap-x-2 > div.min-w-\\[5\\.2rem\\] > div > span")
          var coin = document.querySelector("#header-root > header > div.flex.h-\\[4\\.125rem\\].items-center.bg-navy-700.md\\:mb-3.md\\:h-\\[5\\.625rem\\] > div.flex.self-stretch.rounded-l-2xl.md\\:bg-navy-800\\/80.order-5.ml-auto > div.flex.items-center.self-stretch.rounded-l-2xl.pl-4.pr-3.md\\:gap-3.md\\:bg-navy-550.md\\:pl-3.lg\\:gap-4.lg\\:px-5 > div.hidden.flex-col.gap-3.md\\:flex > div > a:nth-child(1) > span > span")
          
          var waluty = {
            pln: pieniadze.innerText,
            gold: coin.innerText,
            plnskin: wartoscskinow.innerText
          }

          return waluty;
        } catch (error) {
          throw 0;
        }
  
      })
      
      await page.waitForTimeout(2000)
  
      if(waluty == 0) {
        await page.screenshot({ path: `./screenshots/latesteqscreenERROR.png`}).then(() => {
          telegrambot.sendPhoto(config.telegramiduser, './screenshots/latesteqscreenERROR.png' , {caption: `Wystapil jakis blad w komendzie /info`})
        })
      } else {
        await page.screenshot({ path: `./screenshots/latesteqscreen.png`}).then(() => {
          telegrambot.sendPhoto(config.telegramiduser, './screenshots/latesteqscreen.png' , {caption: `**Saldo twojego konta**\n(odrazu wysylam zdjecie EQ)\n\nPLN: ${waluty.pln}\nZLOTO: ${waluty.gold}\nPLN W SKINACH: ${waluty.plnskin}`})
      })
      }
      browser.close();
    })
}

module.exports = {
    infoCommand,
  };
