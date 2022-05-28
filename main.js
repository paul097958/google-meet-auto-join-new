require('dotenv').config();
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const by = webdriver.By;
const until = webdriver.until;
const options = new chrome.Options()
    .addArguments('allow-file-access-from-files')
    .addArguments('use-fake-device-for-media-stream')
    .addArguments('use-fake-ui-for-media-stream');//allow mi and cam

options.addArguments('--log-level=3');//close console
options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 1 });//close notifications
async function autojoin() {
    let driver = await new webdriver.Builder().forBrowser("chrome").withCapabilities(options).build();
    driver.get('https://www.google.com.tw/');

    /*click button*/
    let signInButton = await driver.wait(until.elementLocated(by.xpath('//*[@id="gb"]/div/div[2]/a')));
    signInButton.click()
    /*write email*/
    let writeEmail = await driver.wait(until.elementLocated(by.xpath('//*[@id="identifierId"]')));
    writeEmail.sendKeys(process.env.gmail);
    /*continewE*/
    let contiE = await driver.wait(until.elementLocated(by.xpath('//*[@id="identifierNext"]')));
    contiE.click()
    /*write password*/
    setTimeout(async function () {
        let writePassword = await driver.wait(until.elementLocated(by.xpath('//*[@id="password"]/div[1]/div/div[1]/input')));
        writePassword.sendKeys(process.env.password);
    }, 3000);
    /*continewP*/
    setTimeout(async function () {
        let contiP = await driver.wait(until.elementLocated(by.xpath('//*[@id="passwordNext"]')));
        contiP.click();
    }, 3000);
    /*seach*/
    setTimeout(async function () {
        let writegooglemeet = await driver.wait(until.elementLocated(by.xpath('/html/body/div[1]/div[3]/form/div[1]/div[1]/div[1]/div/div[2]/input')));
        writegooglemeet.sendKeys('google meet');
    }, 3000);
    /*click seach*/
    setTimeout(async function () {
        let clicksea = await driver.wait(until.elementLocated(by.xpath('/html/body/div[1]/div[3]/form/div[1]/div[1]/div[2]/div[2]/div[2]/ul/li[1]/div/div[2]')));
        clicksea.click();
    }, 3000);
    /*into meet*/
    setTimeout(async function () {
        let clickurl = await driver.wait(until.elementLocated(by.xpath('//*[@id="rso"]/div[1]/div/div/div/div/div/div[1]/a')));
        clickurl.click();
    }, 3000);
    /*enter code*/
    setTimeout(async function () {
        let meetcode = await driver.wait(until.elementLocated(by.xpath('//*[@id="i3"]')));
        meetcode.sendKeys(process.env.googlemeet);
    }, 3000);
    /*join*/
    setTimeout(async function () {
        let joinmeet = await driver.wait(until.elementLocated(by.xpath('//*[@id="yDmH0d"]/c-wiz/div/div[2]/div/div[1]/div[3]/div/div/div[2]/button')));
        joinmeet.click();
    }, 15000);
    /*close the li*/
    setTimeout(async function () {
        let close = await driver.wait(until.elementLocated(by.xpath('/html/body/div/div[3]/div/div[2]/div[3]/div')));
        close.click();
    }, 10000);
    /*close vi*/
    setTimeout(async function () {
        let closevv = await driver.wait(until.elementLocated(by.xpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[9]/div[3]/div/div/div[4]/div/div/div[1]/div[1]/div/div[4]/div[2]/div/div')));
        closevv.click();
    }, 10000);
    /*close mi*/
    setTimeout(async function () {
        let closemi = await driver.wait(until.elementLocated(by.xpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[9]/div[3]/div/div/div[4]/div/div/div[1]/div[1]/div/div[4]/div[1]/div/div/div')));
        closemi.click();
    }, 10000);
    /*finall join*/
    setTimeout(async function () {
        let fijj = await driver.wait(until.elementLocated(by.xpath('//*[@id="yDmH0d"]/c-wiz/div/div/div[9]/div[3]/div/div/div[4]/div/div/div[2]/div/div[2]/div/div[1]/div[1]/div[2]')));
        fijj.click();
    }, 15000);





}
autojoin()





