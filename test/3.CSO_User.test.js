require('chromedriver');
const{Builder, Browser, Key, By, Select, until} = require('selenium-webdriver');
const {describe, before, beforeEach, afterEach, after, it} = require('mocha')
const chai = require('chai');
const expect = chai.expect();
let addContext = require("mochawesome/addContext")
const fs = require('fs');

describe('CSO DataUser ', async () => {
    try {
        let driver;
        before(async () => {
            driver = await new Builder().forBrowser(Browser.CHROME).build();
            await driver.manage().window().maximize();
            await driver.get('https://intern1.cbn.net.id/contract')
            await driver.findElement(By.name('username')).sendKeys('David');
            await driver.findElement(By.name('password')).sendKeys('password', Key.RETURN);
            await driver.findElement(By.xpath('/html/body/div/nav/div[1]/div/div[1]/div[2]/div/a[2]')).click();
        });

        afterEach(async function () {
            await driver.sleep(2000);
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
          });


        describe('CSO DataUser - view', async () => {

            it('User melihat Halaman Data User', async () => {
                const title = await driver.findElement(By.xpath('/html/body/div/header/div/h1')).getText();
                chai.expect(title).to.equal('View Data Users');
            })

        })  

        describe('CSO DataUser - Add New User', async () => {

            async function inputFormUser(Status, Nama, Username, Email, Password) {
                const selectStatus = driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[1]/select'));
                const select = new Select(selectStatus);
                driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[1]/select/option[2]')); //admin
                driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[1]/select/option[2]')); //unit head
                driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[1]/select/option[3]')); //cae
                select.selectByIndex(Status);

                driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/input')).sendKeys(Nama);
                driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[3]/input')).sendKeys(Username);
                driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[4]/input')).sendKeys(Email);
                driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[5]/input')).sendKeys(Password);

            };

            beforeEach(async () => {await driver.get('https://intern1.cbn.net.id/users/create')})

            it('User masuk ke Form add new data User', async () => {
                const nameform = await driver.findElement(By.xpath('/html/body/div/header/div/h1')).getText();

                chai.expect(nameform).to.equal('Create User');
            })

            it('User input data User dan save data tersebut', async () => {
                await inputFormUser(1, 'Eros', 'Eros 01', 'Eros@gmail.com', '12345678okok#');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('User successfully added')

            });

            it('User input data nama dengan menggunakan angka ', async () => {
                await inputFormUser(1, 'Userbaru0101', 'User 01', 'User@gmail.com', '12345678okok#');
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[2]/div')).getText()
                chai.expect(alert).to.equal('Only letters are allowed.');
            });

            it('User input data  Nama dengan menggunakan karakter spesial', async () => {
                await inputFormUser(1, 'Userbaru##$1255', 'User 01', 'User@gmail.com', '12345678okok#');
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[2]/div')).getText()
                chai.expect(alert).to.equal('Only letters are allowed.');
            });

            it('User input data Username dengan menggunakan beberapa jenis karakter yang berbeda', async () => {
                await inputFormUser(1, 'Brian', 'Brian##01.com', 'Brian@gmail.com', '12345678okok#');
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('User successfully added')
            });

            it('User  input data Email dengan format yang tidak sesuai dan save data tersebut', async () => {
                await inputFormUser(1, 'Userbaru', 'User01', 'User@.com.gmail##', '12345678okok#');
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[4]/div')).getText();
                chai.expect(alert).to.equal('Invalid email format');
            });

            it('User input data Password kurang dari 8 karakter', async () => {
                await inputFormUser(1, 'Userbaru', 'User01', 'User@gmail.com', '1234567');
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[5]/div')).getText();
                chai.expect(alert).to.equal('Minimum 8 characters.');
            });

            it('User add data tanpa menginput data Username dan save data tersebut', async () => {
                await inputFormUser(1, 'Userbaru', '', 'User@gmail.com', '12345678okok#');
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[3]/div')).getText();
                chai.expect(alert).to.equal('Username cannot be empty.');
            });

            it('User add data tanpa menginput data Name dan save data tersebut', async () => {
                await inputFormUser(1, '', 'User01', 'User@gmail.com', '12345678okok#');
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[2]/div')).getText();
                chai.expect(alert).to.equal('Name cannot be empty.');
            });

            it('User add data tanpa menginput data Email dan save data tersebut', async () => {
                await inputFormUser(1, 'Userbaru', 'User01', '', '12345678okok#');
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[4]/div')).getText();
                chai.expect(alert).to.equal('Email cannot be empty.');
            });

            it('User add data tanpa menginput data Password dan save data  tersebut', async () => {
                await inputFormUser(1, 'Userbaru', 'User01', 'User@gmail.com', '',);
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[5]/div')).getText();
                chai.expect(alert).to.equal('Password cannot be empty.');
            });

            it('User mengcancel pembuatan user baru', async () => {
                await driver.findElement(By.xpath('/html/body/div[1]/main/div/div/form/div[6]/a')).click()

                const getNamaHalaman = await driver.findElement(By.xpath('/html/body/div/header/div/h1')).getText();
                chai.expect(getNamaHalaman).to.equal('View Data Users');
            });
        })

        describe('CSO DataUser - Edit', async () => {

            beforeEach(async () => {
                await driver.get('https://intern1.cbn.net.id/users/3/edit');
            });

            it('User masuk  ke form edit data User', async () => {
                const getNamaHalaman = await driver.findElement(By.xpath('/html/body/div/header/div/h1')).getText();
                chai.expect(getNamaHalaman).to.equal('Edit Data Users');
            });
            
            it('User edit data  nama dan save data tersebut', async () => {
                const editNama = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[2]/input'));
                editNama.clear();
                editNama.sendKeys('Userbaruedit');
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Successfully Updated');
            });

            it('User edit data  Username dan save data tersebut', async () => {
                const editUsername = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[3]/input'));
                editUsername.clear();
                editUsername.sendKeys('User01edit');
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Successfully Updated');
            });

            it('User edit data  Email dan save data tersebut', async () => {
                const editEmail = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[4]/input'));
                editEmail.clear();
                editEmail.sendKeys('Useredit@gmail.com');
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Successfully Updated');
            });

            it('User edit data Password dan save data  tersebut', async () => {
                const editPassword = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[5]/input'));
                editPassword.clear();
                editPassword.sendKeys('12345678edit');
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Successfully Updated');
            });

            it('User menghapus data nama dan save data tersebut', async () => {
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[2]/input')).clear();
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[2]/div')).getText();
                chai.expect(alert).to.equal('Name cannot be empty.')
                
            });

            it('User menghapus data Username dan save data tersebut', async () => {
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[3]/input')).clear();
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[3]/div')).getText();
                chai.expect(alert).to.equal('Username cannot be empty.')
            });

            it('User menghapus data Email dan save data tersebut', async () => {
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[4]/input')).clear();
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[4]/div')).getText();
                chai.expect(alert).to.equal('Email cannot be empty.')
            });

            it('User save data tanpa menginput menginput password baru', async () => {
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[5]/input')).clear();
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Successfully Updated');
            });

            it('User  mengedit data nama dengan format yang salah', async () => {
                const editNama = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[2]/input'));
                editNama.clear();
                editNama.sendKeys('Userbaruedit99##.S.SH');
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[2]/div')).getText();
                chai.expect(alert).to.equal('Only letters are allowed.');
            });

            it('User mengedit data  Email dengan format yang salah', async () => {
                const editEmail = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[4]/input'));
                editEmail.clear();
                editEmail.sendKeys('Useredit@gmail.SH.com.id####');
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[6]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/form/div[4]/div')).getText();
                chai.expect(alert).to.equal('Invalid email format');
            });


        });

        describe('CSO DataUser - Delete', async () => {

            beforeEach(async () => {await driver.get('https://intern1.cbn.net.id/users')});

            it('Admin User menghapus data user', async () => {
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[2]/table/tbody[5]/tr/td[5]/button')).click();
                await driver.sleep(2000);
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[3]/div/form/div/button[2]')).click();

                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[2]/table/tbody[4]/tr/td[5]/button')).click();
                await driver.sleep(2000);
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[3]/div/form/div/button[2]')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Successfully Deleted');
            });

        })

        describe('CSO DataUser - Search', async () => {

            beforeEach(async () => {await driver.get('https://intern1.cbn.net.id/users')});

            it('User Search data User dengan keyword Nama User', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('David Richardo Gultom');
                await driver.sleep(1000);
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[1]/div[1]/form/div/div[2]/button')).click();

                const getdata = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[2]/table/tbody/tr/td[2]')).getText();
                chai.expect(getdata).to.equal('David Richardo Gultom');
            })

            it('User Search data User dengan keyword Username', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('David');
                await driver.sleep(1000);
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[1]/div[1]/form/div/div[2]/button')).click();

                const getdata = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[2]/table/tbody/tr/td[3]')).getText();
                chai.expect(getdata).to.equal('David');
            })

            it('User Search data User dengan keyword Email', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('DavidgultomM@gmail.com');
                await driver.sleep(1000);
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[1]/div[1]/form/div/div[2]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data not aviable');
            })

            it('User search data dengan keyword ID', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('3');
                await driver.sleep(1000);
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[1]/div[1]/form/div/div[2]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data not aviable');
            })

            it('User Search data tanpa keyword', async () => {
                await driver.findElement(By.xpath('/html/body/div/main/div[1]/div/div[1]/div[1]/form/div/div[2]/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Search can not be empty');
            })

        })

        after(async () => {await driver.quit()});

    }catch(err){
        console.log(err)
    }
});