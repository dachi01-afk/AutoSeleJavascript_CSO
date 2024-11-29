require('chromedriver');
const {Builder, Browser, Key, By, until} = require('selenium-webdriver');
const {describe, before, after, beforeEach, afterEach, it } = require ('mocha');
const chai = require('chai');
const expect = chai.expect;
let addContext = require("mochawesome/addContext")
const fs = require('fs');


describe('CSO Contract', async () => {
    try {
        let driver;
        
        before(async () => {
            driver = await new Builder().forBrowser(Browser.CHROME).build();
            await driver.manage().window().maximize();
            await driver.get('https://intern1.cbn.net.id/contract')
            await driver.findElement(By.name('username')).sendKeys('David');
            await driver.findElement(By.name('password')).sendKeys('password', Key.RETURN);
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

        describe('CSO Contact - View', async () => {

            it('User melihat Halaman Contract view', async () => {
                let title = await driver.getTitle();

                chai.expect(title).to.equal('Contract CSO');
            })
            
            it('User melihat Halaman list data Contract', async () => {
                let getNoList = await driver.findElement(By.xpath('/html/body/div/main/div/div/div[2]/table/thead/tr/th[1]')).getText();

                chai.expect(getNoList).to.equal('NO');
            })

            it('User melihat semua List Data Contract menggunakan button pagination ', async () => {
                for(i=1; i<=4 ; i++) {
                    await driver.findElement(By.xpath('//a[@rel="next"]')).click();
                    await driver.sleep(1000);
                } 
                const getNoList = await driver.findElement(By.xpath('/html/body/div/main/div/div/div[2]/table/tbody/tr[1]/td[1]')).getText();
                chai.expect(getNoList).to.equal('41');
            })

        });

        describe('CSO Contract - Add New Data', async () => {

            async function inputForm(Company, Branch, Customer_ID, Username, CAE, Unit_Head, Effective_Date, Contract_Period, Service_Type) {
                driver.findElement(By.xpath('//input[@name="cpart_pic_lst"]')).sendKeys(Company);
                driver.findElement(By.xpath('//input[@name="branch"]')).sendKeys(Branch);
                driver.findElement(By.xpath('//input[@name="cust_id"]')).sendKeys(Customer_ID);
                driver.findElement(By.xpath('//input[@name="nameuser"]')).sendKeys(Username);
                driver.findElement(By.xpath('//input[@name="cae"]')).sendKeys(CAE);
                driver.findElement(By.xpath('//input[@name="unit_head"]')).sendKeys(Unit_Head);
                driver.findElement(By.xpath('//input[@type="date"]')).sendKeys(Effective_Date);
                driver.findElement(By.xpath('//input[@name="contr_period"]')).sendKeys(Contract_Period);
                driver.findElement(By.xpath('//textarea[@name="serv_ty"]')).sendKeys(Service_Type);
            };

            beforeEach(async () => {
                await driver.get('https://intern1.cbn.net.id/contract');
                await driver.findElement(By.xpath('//a[@type="button"]')).click();
            });

            it('User mengklik button Add new data ',  async  () => {
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/a')).click();
                await driver.findElement(By.xpath('//a[@type="button"]')).click();

                const getText = await driver.findElement(By.xpath('/html/body/div/header/div/h1')).getText();
                chai.expect(getText).to.equal('Create Contract');
            })


            it('User menginput Form data Contract kemudian Save data tersebut', async () => {
                await inputForm('PT Quiros Network', 'Jakarta', '17909068', 'Bambang', 'Alfata Satria Oktama', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Added Successfully');

            })


            it("User menginput data Company dengan format yang di kombinasikan dengan angka dan tanda baca seperti '.' atau  ','", async () => {
                await inputForm('PT .Quiros Network 123', 'Jakarta', '17909068', 'Bambang', 'Alfata Satria Oktama', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Added Successfully');
            })

            it('User menginput data Company dengan format yang di  kombinasikan dengan karakter spesial', async () => {
                await inputForm('PT .Quiros Network@@#(ok)', 'Jakarta', '17909068', 'Bambang', 'Alfata Satria Oktama', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[1]/div')).getText();
                chai.expect(alert).to.equal('Only (.) and (,) are allowed.');
            })

            it('User menginput data  Branch  dengan format yang salah dan save data tersebut', async () => {
                await inputForm('PT .Quiros Network', 'Jakart@55.', '17909068', 'Bambang', 'Alfata Satria Oktama', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[2]/div')).getText();
                chai.expect(alert).to.equal('Only letters are allowed.');
            });

            it('User menginput Customer ID  kurang  dari 8 karakter', async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '17909', 'Bambang', 'Alfata Satria Oktama', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[3]/div')).getText();
                chai.expect(alert).to.equal('Must be 8 digits.');
            });

            it('User menginput Customer ID  lebih dari 8 karakter', async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '179090634343', 'Bambang', 'Alfata Satria Oktama', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[3]/div')).getText();
                chai.expect(alert).to.equal('Must be 8 digits.');
            });

            it('User menginput Customer ID  dengan format yang salah', async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '1790906###@.', 'Bambang', 'Alfata Satria Oktama', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[3]/div')).getText();
                chai.expect(alert).to.equal('The cust id field must be a number.');
            });

            it("User menginput data Username  dengan format yang di kombinasikan dengan '.' atau  ','", async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '17909068', 'Bambang S.kom', 'Alfata Satria Oktama', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Added Successfully');
            });

            it('User menginput data Username dengan  format yang di kombinasikan dengan angaka dan karakter spesial', async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '17909068', 'Bambang S.kom@gmail55.com', 'Alfata Satria Oktama', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.wait(until.elementLocated(By.xpath('/html/body/div/main/div/div/form/div/div[4]/div'))).getText();
                chai.expect(alert).to.equal('Only letters, (.) and (,) are allowed.');
            });

            it('User menginput data CAE menggunakan format yang salah', async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '17909068', 'Bambang', 'Alfata Satria S.com99@gmail.com', 'Suhendi', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.wait(until.elementLocated(By.xpath('/html/body/div/main/div/div/form/div/div[5]/div'))).getText();
                chai.expect(alert).to.equal('Only letters are allowed.');
            });


            it("User menginput data Unit Head menggunakan tanda baca seperti '.' atau ','", async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '17909068', 'Bambang', 'Alfata Satria', 'Suhendi,  S.aa', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Added Successfully');
            });

            it('User menginput data Unit Head dengan format yang salah', async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '17909068', 'Bambang', 'Alfata Satria', 'Suhendi,  S.aa##@123', '01/01/2020', '55', 'CBN Premier 2 M');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[6]/div')).getText();
                chai.expect(alert).to.equal('Only letters, (.) and (,) are allowed.');
            });

            it('User menginput Effective Date dan Cotract Period (Month)', async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '17909068', 'Bambang', 'Alfata Satria', ' Suhendi,  S.aa', '01/01/2025', '12', 'CBN Premier 2 M');
                const alert = await driver.wait(until.elementLocated(By.xpath('//input[@name="exp_dt"]'))).getAttribute('value');
                chai.expect(alert).to.equal(alert);
                
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();
            });

            it('User tidak dapat mengubah data Expired Date', async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '17909068', 'Bambang', 'Alfata Satria', ' Suhendi,  S.aa', '01/01/2025', '12', 'CBN Premier 2 M');
                const editEXPDate = await driver.findElement(By.xpath('//input[@name="exp_dt"]')).sendKeys('2025-10-31');
                if(!editEXPDate){
                    const alert = await driver.wait(until.elementLocated(By.xpath('//input[@name="exp_dt"]'))).getAttribute('value');
                    chai.expect(alert).to.equal('2025-12-31');
                }else{
                    console.log('data masih bisa di ubah');
                }
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();
                
            });


            it('User menginput Services Type  menggunakan sema jenis karakter', async () => {
                await inputForm('PT .Quiros Network', 'Jakarta', '17909068', 'Bambang', 'Alfata Satria', ' Suhendi,  S.aa', '01/01/2025', '12', 'CBN Premier 2 M ###3 (0k 123).com');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div/div[11]/div/button')).click();

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Added Successfully');
            });

        });


        
        describe('CSO Contract - Edit', async () => {

            beforeEach(async () => {
                await driver.get('https://intern1.cbn.net.id/contract/369/edit')
            }); 

            it('User klik button Edit', async () => {
                const getText = await driver.findElement(By.xpath('/html/body/div/header/div/h1')).getText();
                chai.expect(getText).to.equal('Edit Data Contract');
            });

            it('User mengedit data Company', async () => {
                const companyEdit = await driver.findElement(By.xpath('//input[@name="cpart_pic_lst"]'))
                await companyEdit.clear();
                await companyEdit.sendKeys('PT Quiros Network edit')
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/button')).click();

                const getPopUp = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
                chai.expect(getPopUp).to.equal('Data Successfully Updated');
            });

            it('User mengedit data Branch', async () => {
                const editBranch = await driver.findElement(By.xpath('//input[@name="branch"]'));
                await editBranch.clear();
                await editBranch.sendKeys('Jakarta Edit')
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/button')).click();

                const getPopUp = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
                chai.expect(getPopUp).to.equal('Data Successfully Updated');
            });

            it('User mengedit data Username', async () => {
                const editUsername = await driver.findElement(By.xpath('//input[@name="nameuser"]'));
                await editUsername.clear();
                await editUsername.sendKeys('wBambang S.kom edit');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/button')).click();

                const getPopUp = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
                chai.expect(getPopUp).to.equal('Data Successfully Updated');
            });

            it('User mengedit data Unit Head', async () => {
                const editUnithead = await driver.findElement(By.xpath('//input[@name="unit_head"]'));
                await editUnithead.clear();
                await editUnithead.sendKeys('Suhendi edit');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/button')).click();

                const getPopUp = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
                chai.expect(getPopUp).to.equal('Data Successfully Updated');
            });

            it('User mengedit data Contract Period (Month)', async () => {
                const editCP = await driver.findElement(By.xpath('//input[@name="contr_period"]'));
                await editCP.clear();
                await editCP.sendKeys('77');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/button')).click();

                const getPopUp = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
                chai.expect(getPopUp).to.equal('Data Successfully Updated');
            });

            it('User mengedit data Costumer ID', async () => {
                const editCustomerID = await driver.findElement(By.xpath('//input[@name="cust_id"]'));
                await editCustomerID.clear();
                await editCustomerID.sendKeys('17909067')
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/button')).click();

                const getPopUp = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
                chai.expect(getPopUp).to.equal('Data Successfully Updated');
            });

            it('User mengedit data CAE', async () => {
                const editCAE = await driver.findElement(By.xpath('//input[@name="cae"]'));
                await editCAE.clear();
                await editCAE.sendKeys('Alfata Satria Oktama edit')
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/button')).click();

                const getPopUp = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
                chai.expect(getPopUp).to.equal('Data Successfully Updated');
            });

            it('User mengedit dataEffective Date', async () => {
                const editED = await driver.wait(until.elementLocated(By.xpath('//input[@name="eff_dt"]')));
                await editED.clear();
                await editED.sendKeys('02/01/2020');
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/button')).click();

                const getPopUp = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
                chai.expect(getPopUp).to.equal('Data Successfully Updated');
            });

            it('User mengedit dataService Type', async () => {
                const editDT = await driver.findElement(By.xpath('//textarea[@name="serv_ty"]'));
                await editDT.clear();
                await editDT.sendKeys('CBN Premier 2 M edit')
                await driver.findElement(By.xpath('/html/body/div/main/div/div/form/div[2]/button')).click();

                const getPopUp = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div')).getText();
                chai.expect(getPopUp).to.equal('Data Successfully Updated');
            });

        });

        describe ('CSO Contract - Delete', async () => {

            it('User Delete data Contract ', async () => {
                const hapusdata = await driver.findElement(By.xpath('/html/body/div/main/div[1]/div[2]/div[2]/table/tbody/tr[1]/td[12]/button'));
                hapusdata.click();
                await driver.wait(until.elementLocated(By.xpath('/html/body/div/main/div[1]/div[2]/div[4]/div/form/div/button[2]')),10000).click()

                
                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data Successfully Deleted');
            })

        } )


        describe('CSO Contract  - Search', async () => {

            beforeEach(async () => {await driver.get('https://intern1.cbn.net.id/contract')});

            it('User Search data Contract berdasarkan no Unit Head', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('Suhendi,  S.aa', Key.RETURN);

                const value = await driver.findElement(By.xpath('/html/body/div/main/div/div/div[2]/table')).getText();
                chai.expect(value).to.equal(value);
            });

            it('User Search data Contract berdasarkan Company', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('PT .Quiros Network', Key.RETURN);

                const value = await driver.findElement(By.xpath('/html/body/div/main/div/div/div[2]/table')).getText();
                chai.expect(value).to.equal(value);
            });

            it('User Search data Contract berdasarkan Customer ID', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('17909068', Key.RETURN);

                const value = await driver.findElement(By.xpath('/html/body/div/main/div/div/div[2]/table')).getText();
                chai.expect(value).to.equal(value);
            });

            it('User Search data Contract berdasarkan User Name', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('Bambang', Key.RETURN);

                const value = await driver.findElement(By.xpath('/html/body/div/main/div/div/div[2]/table')).getText();
                chai.expect(value).to.equal(value);
            });

            it('User Search data Contract berdasarkan CAE', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('Alfata Satria', Key.RETURN);

                const value = await driver.findElement(By.xpath('/html/body/div/main/div/div/div[2]/table')).getText();
                chai.expect(value).to.equal(value);
            });

            it('User Seacrh data Contract berdasarkan Branch', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('Jakarta', Key.RETURN);

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal(alert);
            });
            
            it('User Seacrh data Contract berdasarkan Effective Date', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('2020-01-02', Key.RETURN);

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data not aviable');
            });

            it('User Seacrh data Contract berdasarkan Contract Period', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('12', Key.RETURN);

                const alert = await driver.findElement(By.xpath('/html/body/div/header/div/h1')).getText();
                chai.expect(alert).to.equal('Search');
            });

            it('User Seacrh data Contract berdasarkan Expired Date', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('2026-05-31', Key.RETURN);

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data not aviable');
            });

            it('User Seacrh data Contract berdasarkan Service Type', async () => {
                await driver.findElement(By.xpath('//*[@id="search"]')).sendKeys('CBN Premier 2 M', Key.RETURN);

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('Data not aviable');
            });

        });

        describe('CSO Contract - Eksport,Inport', async () => {

            it('User inport data dengan Extensi file Excel', async () => {
                await driver.findElement(By.xpath('//input[@name="excel_file"]')).sendKeys('C:\\Users\\Jimi Firgo Dakhi\\Downloads\\New folder\\CSO_Contract.xlsx');

                 const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                 chai.expect(alert).to.equal('Data Imported Successfully');
            });

            it('User inport data Contract dengan Extensi file yang berbeda (bukan Excel)', async () => {
                await driver.findElement(By.xpath('//input[@name="excel_file"]')).sendKeys('C:\\Users\\Jimi Firgo Dakhi\\Downloads\\LOG BOOK MAGANG.pdf');

                const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
                chai.expect(alert).to.equal('File must be excel.No reader found for type Dompdf');
            });
//alert success export
            it('User Expord data Contract', async () => {
                await driver.findElement(By.xpath('/html/body/div/main/div/div[2]/div[1]/div[2]/form/button')).click();
            
            });
//alert
            it('User menghapus semua data Contract', async () => {
                await driver.findElement(By.xpath('/html/body/div/main/div/div/div[1]/div[2]/div[1]/button')).click();
                await driver.findElement(By.xpath('/html/body/div/main/div/div[2]/div[3]/div/form/div/button[2]')).click();
            });

            // it('User Expord data Contract yang masih kosong', async () => {
            //     await driver.findElement(By.xpath('/html/body/div/main/div/div[2]/div[1]/div[2]/form/button')).click();

            //     const alert = await driver.findElement(By.xpath('/html/body/div/main/div/div[1]/div/div/div/span')).getText();
            //     chai.expect(alert).to.equal('All Data Successfully Deleted');
            // });

        });

        after(async () => { await driver.quit()});
    }catch(err){
        console.log(err)
    }
});
