import fs from 'fs'
import path from 'path'
import { test, chromium, expect } from '@playwright/test';
import type { Page } from '@playwright/test'
import schedule from 'node-schedule'
import sleep from 'sleep-promise';
import open from 'open';
import scheduleFile from '../schedule.json';
require('dotenv').config();
const OPEN_TIME = Number(process.env.OPEN_TIME) || 480 * 60 * 1000
chromium.launch({
  args: [
    "--use-fake-device-for-media-stream",
    `--use-file-for-fake-video-capture=${path.resolve('./resource/device.mjpeg')}`
  ]
})
let lastChat = ''
let firstTime = false;

function getTheChatText(page: Page, code: string) {
  setInterval(() => {
    fs.readFile(path.resolve('./resource/text.txt'), async (err, data) => {
      if (err) throw err;
      let textContent = `${data}`
      // get the input box
      let inputBox = '#bfTqV'
      let clickButton = 'xpath=//html/body/div[1]/c-wiz/div[1]/div/div[10]/div[3]/div[4]/div[2]/div[2]/div/div[5]/span/button'
      if (lastChat == textContent) {
        return
      } else {
        lastChat = textContent
        let handUpButton = 'xpath=//html/body/div[1]/c-wiz/div[1]/div/div[10]/div[3]/div[10]/div[2]/div/div[3]/div/span/button'
        let element = page.locator(handUpButton)
        try {
          if (textContent == '> HU') {
            await expect(element).toHaveAttribute('aria-pressed', 'false')
            await element.click()
            console.log('Hands up');
          } else if (textContent == '> HD') {
            await expect(element).toHaveAttribute('aria-pressed', 'true')
            await element.click()
            console.log('Hands down');
          } else if (textContent == '> BY') {
            await page.click('xpath=//*[@id="ow3"]/div[1]/div/div[10]/div[3]/div[10]/div[2]/div/div[6]/span/button')
            console.log('leave the room');
          } else if (textContent == '> CM') {
            await page.click('xpath=//*[@id="ow3"]/div[1]/div/div[10]/div[3]/div[10]/div[2]/div/div[6]/span/button')
            console.log('leave the room');
            open('https://meet.google.com/' + code)
          } else {
            await page.fill(inputBox, textContent)
            await page.click(clickButton)
            console.log('You send: ' + textContent);
          }
        } catch (error) {
          console.log('You already do that');
        }
      }
    })
  }, 10000)
}

async function joinTheRoom(code: string, long: string, page: Page, firstTime: boolean) {
  async function Login() {
    await page.goto('https://accounts.google.com/');
    // input the email
    await page.fill('#identifierId', process.env.GOOGLE_EMAIL);
    // click the next button
    await page.click('xpath=//html/body/div[1]/div[1]/div[2]/div/div[2]/div/div/div[2]/div/div[2]/div/div[1]/div/div/button');
    console.log('enter email complete');
    // check the password input box is defined
    let passwordInputXpath = 'xpath=//input[@type="password"]';
    await page.fill(passwordInputXpath, process.env.GOOGLE_PASSWORD);
    // click the next button
    await page.click('#passwordNext');
    console.log('enter password complete');
    await sleep(3000);
  }
  if (!firstTime) {
    await Login();
  }
  // go to google meet room
  await page.goto('https://meet.google.com/' + code);
  console.log('go to google meet complete');
  // close the camera
  await page.click('xpath=//*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[1]/div[1]/div/div[4]/div[2]')
  // close the microphone
  await page.click('xpath=//*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[1]/div[1]/div/div[4]/div[1]')
  // join the room
  await page.click('xpath=//*[@id="yDmH0d"]/c-wiz/div/div/div[10]/div[3]/div/div[1]/div[4]/div/div/div[2]/div/div[2]/div/div[1]/div[1]/button')
  console.log('join the room complete');
  // click the open chat box button
  await page.click('xpath=//html/body/div[1]/c-wiz/div[1]/div/div[10]/div[3]/div[10]/div[3]/div[3]/div/div/div[3]/span/button')
  console.log('open the chat box complete');
  getTheChatText(page, code)
  // leave the room
  await sleep(Number(long) * 60 * 1000);
  try {
    await page.click('xpath=//*[@id="ow3"]/div[1]/div/div[10]/div[3]/div[10]/div[2]/div/div[6]/span/button')
    console.log('leave the room');
  } catch (e) {
    return
  }

}

function standBy() {
  test('start joiner', async ({ page, context }) => {
    context.grantPermissions(['camera', 'microphone']);
    // listen time up
    scheduleFile.map(item => {
      let scheduleTimeFormat = `${item.second} ${item.minute} ${item.hour} ${item.date} ${item.month} ${item.day}`
      console.log(scheduleTimeFormat);
      schedule.scheduleJob(scheduleTimeFormat, async () => {
        joinTheRoom(item.code, item.long, page, firstTime)
        firstTime = true;
      })
    })
    await page.goto('https://google.com/');
    await sleep(Number(OPEN_TIME) * 60 * 1000);
    // go to error page
    await page.goto('https://meet.google.com/');
  })
}

standBy()


