require('chromedriver');
const {describe, beforeEach, afterEach, it } = require ('mocha');
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const chai = require('chai');
const expect = chai.expect;
let addContext = require("mochawesome/addContext")
const fs = require('fs');



describe('CSO Login', async () => {
  try {
  let driver;

  beforeEach(async () => { 
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().window().maximize();
    await driver.get('https://intern1.cbn.net.id/login')
  });

  afterEach(async function () {
    const imageFileName = `${this.currentTest.title.replace(/ /g, '_')}.png`;
      const directory = this.currentTest.state === 'failed' 
            ? './CSOReport/EvidenceFail/' 
            : './CSOReport/EvidencePass/';

            const image = await driver.takeScreenshot();
            if (!fs.existsSync(directory)) {
              fs.mkdirSync(directory, { recursive: true });
          }
          fs.writeFileSync(`${directory}${imageFileName}`, image, 'base64');

          addContext(this, `Following is the ${this.currentTest.state} test screenshot`);
          addContext(this, './EvidencePass/'+ `${imageFileName}`);
          addContext(this, './EvidenceFail' + `${imageFileName}`);
    driver.quit(); 
  });


  it('User menginput Username dan Password valid', async () => {
    await driver.findElement(By.name('username')).sendKeys('David');
    await driver.findElement(By.name('password')).sendKeys('password', Key.RETURN);
    

    let Title = await driver.getTitle();
    chai.expect(Title).to.equal('Contract CSO');
    const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
    chai.expect(alert).to.equal(alert);
  });

  it('User menginput Username tidak valid dan Password valid', async () => {
    await driver.findElement(By.name('username')).sendKeys('david123#');
    await driver.findElement(By.name('password')).sendKeys('password', Key.RETURN);
    
    let alert = await driver.findElement(By.xpath('/html/body/section/div/div/div/div/span')).getText();
    chai.expect(alert).to.equal('Your username or password is incorrect');
    
  });
  
  it('User menginput Username valid dan  Password tidak valid', async () => {
    await driver.findElement(By.name('username')).sendKeys('david123#');
    await driver.findElement(By.name('password')).sendKeys('password', Key.RETURN);
    

    let alert = await driver.findElement(By.xpath('//span[@class="block sm:inline"]')).getText();
    chai.expect(alert).to.equal('Your username or password is incorrect');
  });

  it('User menginput  Username tidak valid dan Password tidak valid', async () => {
    await driver.findElement(By.name('username')).sendKeys('david123#');
    await driver.findElement(By.name('password')).sendKeys('password', Key.RETURN);
    

    let alert = await driver.findElement(By.xpath('//span[@class="block sm:inline"]')).getText();
    chai.expect(alert).to.equal('Your username or password is incorrect');
  });

  it('User sign in tanpa menginput Username dan Password', async () => {
    await driver.findElement(By.xpath('/html/body/section/div/div/div/form/button')).click();
    
    let alertun = await driver.findElement(By.xpath('//*[@id="usernameError"]')).getText();
    let alertpw = await driver.findElement(By.xpath('//*[@id="usernamePassword"]')).getText();
    chai.expect(alertun).to.equal('Username cannot be empty.');
    chai.expect(alertpw).to.equal('Password cannot be empty.');
  });

  it('User Sign In menggunakan Username tanpa Password ', async () => {
    await driver.findElement(By.name('username')).sendKeys('david123#', Key.RETURN);
    
    let alert = await driver.findElement(By.xpath('//*[@id="usernamePassword"]')).getText();
    chai.expect(alert).to.equal('Password cannot be empty.');
  });

  it('User Sign In menggunakan Password tanpa Username ', async () => {
    await driver.findElement(By.name('password')).sendKeys('password', Key.RETURN);
    
    let alert = await driver.findElement(By.xpath('//*[@id="usernameError"]')).getText();
    chai.expect(alert).to.equal('Username cannot be empty.');
  });

  it('User klik button Logout', async () => {
    await driver.findElement(By.name('username')).sendKeys('David');
    await driver.findElement(By.name('password')).sendKeys('password', Key.RETURN);
    await driver.sleep(6000);
  
    await driver.findElement(By.xpath('/html/body/div/nav/div[1]/div/div[2]/button')).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath('/html/body/div/main/div[2]/div/form/div/button[2]')).click()

    
    let alert = await driver.findElement(By.xpath('/html/body/section/div/div/div/div/div/div/div/span')).getText();
    chai.expect(alert).to.equal('You have been successfully logged out.');
  });

  } catch(err) {
    console.log(err)
  }

});