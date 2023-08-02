const request = require('request');
var HTMLParser = require('node-html-parser');
const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
const TelegramBot = require('node-telegram-bot-api');

const config = require('../config.json');
const puppeteerENV = require('../puppeteerENV.js')


function getGoldenCards(telegrambot) {
    puppeteer.launch(puppeteerENV).then(async browser => {
        const page = await browser.newPage();

        const cookies = JSON.parse(fs.readFileSync('./cookies/keydrop.json', 'utf8'));
        await page.setCookie(...cookies);

        await page.setJavaScriptEnabled(true);
        await page.setViewport({ width: 3840, height: 2160 });

        await page.goto(`https://key-drop.com/pl/daily-case`);

        await page.waitForTimeout(5000)

        const odbieranie = await page.evaluate(() => {
            try {
                var buttons = document.querySelectorAll('.button,button,button-light-green,pointer-events-none,h-13,w-full,max-w-full,translate-y-3,rounded-xl,px-0,text-11px,opacity-0,transition-all,duration-200,pointer-events-auto,translate-y-0,opacity-0')
    
                var list = [10,12,14,16,18];
            
                const randomIndex = Math.floor(Math.random() * list.length);
                const randNumber = list[randomIndex]
                buttons[randNumber].click();
                return 1;
            } catch (err) {
                throw 0;
            }
        })

        await page.waitForTimeout(2000)

        if(odbieranie == 0) {
            await page.screenshot({ path: `./screenshots/latestgoldencardERROR.png`}).then(() => {
                telegrambot.sendPhoto(config.telegramiduser, `./screenshots/latestgoldencardERROR.png`, { caption: `Blad przy odbieraniu zlotej karty!` });
            });
            
        } else {
            await page.screenshot({ path: `./screenshots/latestgoldencard.png`}).then(() => {
                telegrambot.sendPhoto(config.telegramiduser, `./screenshots/latestgoldencard.png`, { caption: `**ODEBRANO ZLOTA KARTE! (chyba xd)**\nZobacz na screenie co ci wypadlo!` });
                console.log('Uzyto zlotej karty!')
            });
        }
        browser.close();

    })
}

module.exports = { getGoldenCards }