// select engineering design product designer product cto other sauf mechanical
const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const USERNAME_SELECTOR = '#user_email';
const PASSWORD_SELECTOR = '#user_password';
const SUBMIT_SELECTOR = '[type="submit"]';



async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 900;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 900);
        });
    });
}


(async () => {
    /** Solve captcha problem */
    puppeteerExtra.use(pluginStealth());
    const browser = await puppeteerExtra.launch({ headless: false, defaultViewport: null, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', });
    const page = await browser.newPage();
    await page.goto('https://angel.co/login');
   
    await page.waitForTimeout(3000);

    /** Login */
    await page.click(USERNAME_SELECTOR);
    //await page.type(username);
    await page.$eval('#user_email', email => email.value = 'hl_medjahed@esi.dz');
    await page.click(PASSWORD_SELECTOR);
    await page.$eval('#user_password', password => password.value = 'lamiamedjahed');
    await page.click(SUBMIT_SELECTOR);
    await page.waitForTimeout(3000);
    /**Dismiss */
    await page.waitForSelector(".styles_dismiss__2NKYW");
    await page.waitForTimeout(3000);

    await page.click(".styles_dismiss__2NKYW");
    
/**Choose newest offers */
//await page.waitForSelector(".styles_component__1mMWs > button > svg");
await page.waitForTimeout(3000);

await page.click(".styles_component__1mMWs > button > svg");
await page.waitForTimeout(1000);
const newest = await page.$$('.styles_component__9NDgl');
await newest[1].click();
 
await page.click('.styles_plusIcon__1nD9X'); // cliquer sur add


    /** Delete location info */
   /* var location = await page.$eval('.styles_label__2KDBZ', location => location.textContent);
    await page.waitForTimeout(4000);
    await page.click('[data-test="SearchBar"] > div > .styles_locationWrapper__ScGs8 ');
    while(location!="Add a location"){
        await page.keyboard.press('Backspace');
        await page.click('.styles_component__17zbz');
         location = await page.$eval('.styles_label__2KDBZ', location => location.textContent);
        await page.click('[data-test="SearchBar"] > div > .styles_locationWrapper__ScGs8 ');
    
    }*/
    await page.keyboard.type('France');
    await page.waitForTimeout(4000);
    await page.keyboard.press('Enter');
   // await page.click('.styles_component__17zbz');
   // await page.waitForTimeout(4000);
    
    
 /*   await page.waitForSelector('.styles_label__3SiOW.styles_blackLabel__u8FI1'); //click on remote buttton
    await page.click('.styles_label__3SiOW.styles_blackLabel__u8FI1');
    await page.waitForTimeout(3000);
    // read the value of the box
    var remoteLocation = await page.$eval('#RemotePrefereceSelectField-menu div.styles_filter__44NUE button.styles_component__gXIVj div.styles_component__1WTsC.styles_flexRow__35QHu.__halo_row_valign_center.__halo_padding_left_1.__halo_padding_right_1 .styles_label__2KDBZ', remoteLocation => remoteLocation.textContent);
    console.log(remoteLocation);
    await page.waitForTimeout(8000);
    await page.click('#RemotePrefereceSelectField-menu div.styles_filter__44NUE button.styles_component__gXIVj div.styles_component__1WTsC.styles_flexRow__35QHu.__halo_row_valign_center.__halo_padding_left_1.__halo_padding_right_1 svg');

    while(remoteLocation!="Add a location"){ //delete current data
        await page.keyboard.press('Backspace');    
      //  await page.click('.styles_component__17zbz');
        await page.click('.styles_label__3SiOW.styles_blackLabel__u8FI1');
        remoteLocation = await page.$eval('#RemotePrefereceSelectField-menu div.styles_filter__44NUE button.styles_component__gXIVj div.styles_component__1WTsC.styles_flexRow__35QHu.__halo_row_valign_center.__halo_padding_left_1.__halo_padding_right_1 .styles_label__2KDBZ', remoteLocation => remoteLocation.textContent);
        console.log(remoteLocation);
        await page.waitForTimeout(8000);
       // await page.click('div.styles_filter__44NUE button.styles_component__gXIVj.styles_hasLocations__AbOX4');
      // await page.click('#RemotePrefereceSelectField-menu .styles_filter__44NUE .styles_component__gXIVj.styles_hasLocations__AbOX4 div svg');
      await page.click('#RemotePrefereceSelectField-menu div.styles_filter__44NUE button.styles_component__gXIVj div.styles_component__1WTsC.styles_flexRow__35QHu.__halo_row_valign_center.__halo_padding_left_1.__halo_padding_right_1 svg');

       await page.waitForTimeout(2000);
    
    }
    await page.keyboard.type('France');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');


    /** write jobs titles */
   /* await page.waitForTimeout(3000);
    await page.click('[data-test="SearchBar-RoleSelect-FocusButton"]');
    await page.keyboard.type("Engineering");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Software Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Mobile Developer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("iOS Developer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Android Developer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Frontend Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Backend Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Full-Stack Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Software Architect");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Embedded Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Data Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Security Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Machine Learning Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Engineering Manager");
    await page.keyboard.press('Enter');
    await page.keyboard.type("QA Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("DevOps");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Data Scientist");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Designer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("User Researcher");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Visual Designer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Creative Director");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Graphic Designer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Product Designer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Product Manager");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Product");
    await page.keyboard.press('Enter');
    await page.keyboard.type("CTO");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Other Engineering");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Hardware Engineer");
    await page.keyboard.press('Enter');
    await page.keyboard.type("Systems Engineer");
    await page.keyboard.press('Enter');
    
    
    
    /**Open filters */
    /*await page.waitForSelector(".styles_arrowDownIcon__1Ypu8");
    await page.click(".styles_arrowDownIcon__1Ypu8");
    await page.waitForTimeout(50);
    await page.click(".styles_arrowDownIcon__1Ypu8");
    /**Choose job details */
   /* await page.waitForTimeout(3000);
    await page.click(".styles_header__PMZlN button"); //clear
    await page.click('[for="form-input--jobTypes--full_time"]');
    await page.click('[for="form-input--jobTypes--contract"]');
    /**Click on view result */
    /*await page.click('[data-test="SearchBar-ViewResultsButton"]');
    await page.waitForTimeout(2000);*/

   
    await page.goto(url).catch(e => {});
    await page.waitForTimeout(4000);
  
    /** Get poste name */
    await page.waitForSelector('.styles_component__1kg4S.styles_header__3m1pY.__halo_fontSizeMap_size--2xl.__halo_fontWeight_medium');
    const Poste = await page.$eval('.styles_component__1kg4S.styles_header__3m1pY.__halo_fontSizeMap_size--2xl.__halo_fontWeight_medium', Poste => Poste.textContent);
    /** Get Saliare value */
    try {
        var Salaire = await page.$eval('.styles_subheader__-c7fc', Salaire => Salaire.textContent);
    }
    catch { Salaire = ""; }
    /** Get type job and location */
    const Location = await page.$eval('.styles_component__3VQS8 .styles_component__1iUh1 .styles_characteristic__3-A9g dd .styles_component__26gqE span', Location => Location.textContent);
   
    /** Get list of skills */
    try {
        var Skills = await page.evaluate(() => {
            return [...document.body.querySelectorAll('.styles_component__3VQS8 .styles_component__1iUh1 .styles_characteristic__3-A9g .styles_skillPillTags__3qyaY a')]
                .map(element => element.innerText)
  
        });
    }
    catch { Skills = "" }
    /** Get offer description */
    const Description = await page.evaluate(() => {
        return [...document.body.querySelectorAll('.styles_description__4fnTp')]
            .map(element => element.innerText)
            .join('\n');
    });
     const experience = "";
     if (Description.includes('About you')){
           experience = Description.substring(Description.indexOf('About you'), Description.indexOf());
     }
     if (Description.includes('//About you')){

    }
    if (Description.includes('Requirements')){

    }
    if (Description.includes('Experience')){

    }
     if (Description.includes('Qualifications')){

     }
   console.log(j);
    console.log(Poste);
    console.log(Salaire);
    console.log(Location);
    console.log(Skills);                     
    console.log(Description);
    





})();
