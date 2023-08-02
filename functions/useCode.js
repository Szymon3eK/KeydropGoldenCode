const puppeteer = require('puppeteer-extra'); 
const fs = require('fs');

const { telegramsend } = require('./telegramNotify.js')
const puppeteerENV = require('../puppeteerENV.js')


function useCode(code, telegrambot) {
    puppeteer.launch(puppeteerENV).then(async browser => {

        if(code.length != 17) return 0;

        const page = await browser.newPage();

        const cookies = JSON.parse(fs.readFileSync('./cookies/keydrop.json', 'utf8'));
        await page.setCookie(...cookies);

        await page.setJavaScriptEnabled(true);
        await page.setViewport({ width: 1366, height: 768 });

        await page.goto(`https://key-drop.com/pl/?code=${code}`);

        await page.waitForTimeout(5000)

        const odbieranie = await page.evaluate(() => {
          try {

            var goldencodebutton = document.querySelector("#headlessui-dialog-panel-3 > div.shrink-0 > div > button.flex.h-full.flex-1.items-center.justify-center.gap-x-3.bg-\\[\\#23232D\\].text-sm.uppercase.text-white.transition-colors.duration-150.hover\\:bg-navy-500")
            goldencodebutton.click()

            return 1;
          } catch(error) {
            throw 0;
          }
        })

        await page.waitForTimeout(1000)

        await page.type(`#headlessui-dialog-panel-3 > div.shrink-1.custom-scrollbar.relative.h-full.grow.overflow-hidden.overflow-y-auto.overflow-x-hidden.transition-opacity.duration-200 > div > div.rounded-b-xl.bg-\\[\\#1F1F27\\].p-2.sm\\:p-8 > div.relative.z-10.rounded-xl.bg-navy-750.p-5 > div > div > input`, code, {delay: 100});

        await page.waitForTimeout(2000)

        await page.click("#headlessui-dialog-panel-3 > div.shrink-1.custom-scrollbar.relative.h-full.grow.overflow-hidden.overflow-y-auto.overflow-x-hidden.transition-opacity.duration-200 > div > div.rounded-b-xl.bg-\\[\\#1F1F27\\].p-2.sm\\:p-8 > div.relative.z-10.rounded-xl.bg-navy-750.p-5 > div > button");

        await page.waitForTimeout(1000)

        if(odbieranie == 1) {
          await page.screenshot({ path: `./screenshots/latestgoldencode.png`}).then(() => {
            telegramsend(code, telegrambot, 1);
            console.log('Uzyto kodu!')
          })
        } else {
          await page.screenshot({ path: `./screenshots/latestgoldencodeERROR.png`}).then(() => {
            telegramsend(code, telegrambot, 0);
            console.log('Uzyto kodu!')
          })
        }

        browser.close();
         

    })
}

module.exports = { useCode }