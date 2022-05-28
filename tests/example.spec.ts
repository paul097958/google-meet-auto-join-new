import fs from 'fs'
import path from 'path'
import { test, chromium } from '@playwright/test';
import schedule from 'node-schedule'
import sleep from 'sleep-promise';
import scheduleFile from '../schedule.json';
require('dotenv').config();
chromium.launch({
  args: [
    "--use-fake-device-for-media-stream",
    `--use-file-for-fake-video-capture=${path.resolve('./video/device.mjpeg')}`
  ]
})
// app.get('/text', (req, res) => {
//   let textContent = `${req.query.text}`
//   // get the input box
//   let inputBox = '#bfTqV'
//   page.fill(inputBox, textContent)
// });
// app.listen(port)

function getTheChatText() {

}

async function joinTheRoom(code: string, long: string, page:any) {
    // listen text request
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
    // leave the room
    await sleep(Number(long) * 60 * 1000);
    await page.click('xpath=//*[@id="ow3"]/div[1]/div/div[10]/div[3]/div[10]/div[2]/div/div[6]/span/button')
    console.log('leave the room');
}

function standBy(){
  test('standBy', async ({ page, context })=>{
    context.grantPermissions(['camera', 'microphone']);
    // listen time up
    scheduleFile.map(item => {
      let scheduleTimeFormat = `${item.second} ${item.minute} ${item.hour} ${item.date} ${item.month} ${item.day}`
      schedule.scheduleJob(scheduleTimeFormat, async () => {
        joinTheRoom(item.code, item.long, page)
      })
    })
    await page.goto('https://google.com/');
    await sleep(Number(process.env.OPEN_TIME) * 60 * 1000);
    // go to error page
    page.goto('https://meet.google.com/');
  })
}

standBy()


