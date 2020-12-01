// select engineering design product designer product cto other sauf mechanical
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const readline = require('readline-sync');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const performance = require('perf_hooks').performance;
const USERNAME_SELECTOR = '#user_email';
const PASSWORD_SELECTOR = '#user_password';
const SUBMIT_SELECTOR = '[type="submit"]';




function UTF8(file) {
    let fileContents = fs.readFileSync(file);
    fs.writeFileSync(file, "\ufeff" + fileContents);
  }
  
async function writeCSV(scrapedData, outputFile) {

    const csvWriter = createCsvWriter({
      path: outputFile,
      header: [
  
        { id: 'StartupName', title: 'STARTUP' },
        { id: 'StartupLink', title: 'STARTUP WEBSITE' },                                     
        { id: 'Id', title: 'IDOFFRE' },
        { id: 'Poste', title: 'POSTE' },
        { id: 'Salaire', title: 'SALAIRE' },
        { id: 'Location', title: 'Location' },
        { id: 'Skills', title: 'SKILLS' },
        { id: 'Description', title: 'DESCRIPTION' },
  
      ],
      fieldDelimiter: ";"
  
    });
    await csvWriter.writeRecords(scrapedData);
    UTF8(outputFile);
  };



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
            }, 400);
        });
    });
}


/** Function for scrolling */
async function scroll(page){
    const set = new Set();
    var new_size = set.size;
    var old_size=-1;

    while(new_size!=old_size){
    await autoScroll(page);

   

  
       console.log("just finished");
       const AllLinks = await page.$$eval('[data-test="StartupResult"] div.styles_headerContainer__18vw1 a', as => as.map(a => a.href));
      for(let link of AllLinks){
       if(!!link.toString())set.add(link.toString());
      }
      old_size = new_size;
       new_size= set.size;
       console.log('old',old_size,'new',new_size);
       await page.waitForTimeout(3000);
    }
       return set;
   };


async function getJobsLink(url,page) {
    await page.goto(url).catch(e => {});
    /** Get website */
    const link = await page.$eval('.styles_component__34UEK.styles_component__2yJfJ.styles_about__1wadW .styles_component__DaQ39 .styles_websiteLink__Czyi0 a', a => a.href);
    console.log(link);
    /** Get start-up name */
    const Sname = await page.$eval('.styles_component__1c6JC.styles_defaultLink__1mFc1.styles_anchor__2aXMZ', a => a.innerText);
  

    const value = await page.$eval('.styles_component__1YnyN.styles_jobCounter__2iZ-f.styles_red__1FvCF.styles_sm__xD9Ye', element => element.innerText);
    if (value != "0") {
        const Filter = await page.evaluate(() => {
            return [...document.body.querySelectorAll('.styles_component__34UEK.styles_component__LLUAB.styles_solidBluegray__3uLnY .styles_component__3t0_w .styles_field__LqqCf')]
                .map(element => element.textContent)

        });
        await page.waitForTimeout(3000);
        /**Select filters */
        if (Filter.includes("Designer")) {

            await page.waitForTimeout(4000);

            await page.$$eval('.styles_field__LqqCf', selectorMatched => {
                for (i in selectorMatched)
                    if (selectorMatched[i].textContent === 'Designer') {
                        selectorMatched[i].click();
                    }
            });
        }
        if (Filter.includes("Engineering")) {
            await page.waitForTimeout(4000);
            await page.$$eval('.styles_field__LqqCf', selectorMatched => {
                for (i in selectorMatched)
                    if (selectorMatched[i].textContent === 'Engineering') {
                        selectorMatched[i].click();
                    }
            });
        }
        if (Filter.includes("Product")) {
            await page.waitForTimeout(4000);
            await page.$$eval('.styles_field__LqqCf', selectorMatched => {
                for (i in selectorMatched)
                    if (selectorMatched[i].textContent === 'Product') {
                        selectorMatched[i].click();
                    }
            });
        }
        if (Filter.includes("Other")) {
            await page.waitForTimeout(4000);
            await page.$$eval('.styles_field__LqqCf', selectorMatched => {
                for (i in selectorMatched)
                    if (selectorMatched[i].textContent === 'Other') {
                        selectorMatched[i].click();
                    }
            });
        }

        const setLinks = new Set();
        const hrefs = await page.$$eval('.styles_component__1_YxE.styles_expanded__31zII a', as => as.map(a => a.href));
        for(let href of hrefs ){
            if(!!href.toString())setLinks.add(href.toString());
        }
       console.log(setLinks);
        return { 
            setLinks, 
            link,
             Sname, }
    }


};


async function getOfferDetails(page,url,Sname,Slink,j) {
 //   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    await page.goto(url).catch(e => {});
    await page.waitForTimeout(4000);
  
    /** Get poste name */
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
  /* console.log(j);
    console.log(Poste);
    console.log(Salaire);
    console.log(Location);
    console.log(Skills);
    console.log(Description);*/
    return{
        StartupName : Sname,
        StartupLink : Slink,
        Id:j,
        Poste: Poste,
        Salaire: Salaire,
        Location : Location,
        Skills : Skills,
        Description : Description,
    }
  
  
  };

(async () => {
    /** Solve captcha problem */
    puppeteerExtra.use(pluginStealth());
    
    const browser = await puppeteerExtra.launch({ headless: false, defaultViewport: null,executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', });
    const page = await browser.newPage();
    await page.goto('https://angel.co/login');
   
    var start=performance.now();
    /** Login */
    await page.click(USERNAME_SELECTOR);
    //await page.type(username);
    await page.$eval('#user_email', email => email.value = 'hl_medjahed@esi.dz');
    await page.click(PASSWORD_SELECTOR);
    await page.$eval('#user_password', password => password.value = 'lamiamedjahed');
    await page.click(SUBMIT_SELECTOR);
    await page.waitForTimeout(2000);
    /**Dismiss */
    await page.waitForSelector(".styles_dismiss__2NKYW");
    await page.click(".styles_dismiss__2NKYW");
    
/**Choose newest offers */
//await page.waitForSelector(".styles_component__1mMWs > button > svg");
await page.waitForTimeout(3000);

await page.click(".styles_component__1mMWs > button > svg");
await page.waitForTimeout(1000);
const newest = await page.$$('.styles_component__9NDgl');
await newest[1].click();


    /** Delete location info */
    var location = await page.$eval('.styles_label__2KDBZ', location => location.textContent);
    await page.waitForTimeout(3000);
    await page.click('[data-test="SearchBar"] > div > .styles_locationWrapper__ScGs8 ');
    while(location!="Add a location"){
        await page.keyboard.press('Backspace');
        await page.click('.styles_component__17zbz');
         location = await page.$eval('.styles_label__2KDBZ', location => location.textContent);
        await page.click('[data-test="SearchBar"] > div > .styles_locationWrapper__ScGs8 ');
    
    }
    await page.keyboard.type('France');
    await page.waitForTimeout(4000);
    await page.keyboard.press('Enter');
    await page.click('.styles_component__17zbz');
    await page.waitForTimeout(2000);
    
    
    /*await page.waitForSelector('.styles_label__3SiOW.styles_blackLabel__u8FI1'); //click on remote buttton
    await page.click('.styles_label__3SiOW.styles_blackLabel__u8FI1');
    await page.waitForTimeout(7000);
    // read the value of the box
    var remoteLocation = await page.$eval('#RemotePrefereceSelectField-menu div.styles_filter__44NUE button.styles_component__gXIVj div.styles_component__1WTsC.styles_flexRow__35QHu.__halo_row_valign_center.__halo_padding_left_1.__halo_padding_right_1 .styles_label__2KDBZ', remoteLocation => remoteLocation.textContent);
    console.log(remoteLocation);
    await page.waitForTimeout(3000);
    //await page.click('div.styles_filter__44NUE button.styles_component__gXIVj.styles_hasLocations__AbOX4'); // click on the box
    await page.click('#RemotePrefereceSelectField-menu div .styles_component__gXIVj.styles_hasLocations__AbOX4 div svg');
    while(remoteLocation!="Add a location"){ //delete current data
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(3000);
    
        await page.click('.styles_component__17zbz');
        await page.click('.styles_label__3SiOW.styles_blackLabel__u8FI1');
        remoteLocation = await page.$eval('#RemotePrefereceSelectField-menu div.styles_filter__44NUE button.styles_component__gXIVj div.styles_component__1WTsC.styles_flexRow__35QHu.__halo_row_valign_center.__halo_padding_left_1.__halo_padding_right_1 .styles_label__2KDBZ', remoteLocation => remoteLocation.textContent);
        console.log(remoteLocation);
        await page.waitForTimeout(3000);
       // await page.click('div.styles_filter__44NUE button.styles_component__gXIVj.styles_hasLocations__AbOX4');
       await page.click('#RemotePrefereceSelectField-menu .styles_filter__44NUE .styles_component__gXIVj.styles_hasLocations__AbOX4 div svg');
    
       await page.waitForTimeout(2000);
    
    }
    await page.keyboard.type('France');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');*/


    /** write jobs titles */
    await page.click('[data-test="SearchBar-RoleSelect-FocusButton"]');
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
    
    await page.click('.styles_component__17zbz');
    
    /**Open filters */
  /*  await page.waitForSelector(".styles_arrowDownIcon__1Ypu8");
    await page.click(".styles_arrowDownIcon__1Ypu8");
    await page.waitForTimeout(50);
    await page.click(".styles_arrowDownIcon__1Ypu8");
    /**Choose job details */
  //  await page.waitForTimeout(3000);
    //await page.click(".styles_header__PMZlN button"); //clear
    //await page.click('[for="form-input--jobTypes--full_time"]');
    //await page.click('[for="form-input--jobTypes--contract"]');
    /**Click on view result */
    //await page.click('[data-test="SearchBar-ViewResultsButton"]');
    //await page.waitForTimeout(5000);

   const Slinks = await scroll(page);
    // CALL SCROLL FUNCTION
    var scrapedData = [];
    var j=0;
    var number= 1;
    for(let Slink of Slinks){
  
     const objects =await getJobsLink(Slink+'/jobs',page); // Slink is the link of the startup=> from Scroll function
   
    
    for(let lien of objects.setLinks){
         console.log('Inside loop');
          const Startup =objects.Sname; const link =  objects.link;
          console.log(Startup,link);
          const data =await getOfferDetails(page,lien, Startup , link,j);
          console.log(data);
          scrapedData.push(data);
          console.log(data);
          j++;
          var outputFile = './angel-list-Data/batch-' + number + '.csv';
                writeCSV(scrapedData, outputFile);
                if (j % 5000 == 0) {
                  number++;
                  scrapedData = [];
                }
     }
         
    }
    var end=performance.now();
    console.log('execution time: ',(end-start)/60000,'m');
  //  browser.close();

})();
