// select engineering design product designer product cto other sauf mechanical
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
var mysql = require('mysql');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const readline = require('readline-sync');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const performance = require('perf_hooks').performance;
const USERNAME_SELECTOR = '#user_email';
const PASSWORD_SELECTOR = '#user_password';
const SUBMIT_SELECTOR = '[type="submit"]';
var userAgent = require('user-agents');


var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'scrapeddata',
    insecureAuth: true,
});



function UTF8(file) {
    let fileContents = fs.readFileSync(file);
    fs.writeFileSync(file, "\ufeff" + fileContents);
}

async function writeCSV(scrapedData, outputFile) {

    const csvWriter = createCsvWriter({
        path: outputFile,
        header: [

            { id: 'Poste', title: 'POSTE' },
            { id: 'Contrat', title: 'CONTRAT' },
            { id: 'Salaire', title: 'SALAIRE' },
            { id: 'Diplome', title: 'DIPLOME' },
            { id: 'Experience', title: 'EXPERIENCE' },
            { id: 'Travail', title: 'TRAVAIL' },
            { id: 'Skills', title: 'SKILLS' },
            { id: 'Description', title: 'DESCRIPTION' },
            { id: 'IdStartup', title: 'IDSTARTUP' },


        ],
        fieldDelimiter: ";"

    });

    await csvWriter.writeRecords(scrapedData);
    UTF8(outputFile);
};

async function writeCSVStartup(scrapedStartup, outputFile) {

    const csvWriter = createCsvWriter({
        path: outputFile,
        header: [

            { id: 'Startup', title: 'NAME' },
            { id: 'StartupLink', title: 'WEBSITE' },
            { id: 'SourceID', title: 'SOURCEID' },


        ],
        fieldDelimiter: ";"

    });

    await csvWriter.writeRecords(scrapedStartup);
    UTF8(outputFile);
};

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 1000;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}



/** Function for scrolling */
async function scroll(page) {
    const set = new Set();
    var new_size = set.size;
    var old_size = -1;
    var AllLinks = "";
    await page.waitForSelector('.styles_header__3dKUS');
    const NBstartup = await page.$eval('.styles_header__3dKUS', NBstartup => NBstartup.textContent);
    console.log(NBstartup);
    var num = NBstartup.replace(/[^0-9]/g, '');
 
    parseInt(num, 10);
 
  
    await page.waitForTimeout(4000);
    for (let i = 0; i < num; i++) {
        await page.evaluate(_ => {

            window.scrollBy(0, window.innerHeight);

        })

        AllLinks = await page.$$eval('[data-test="StartupResult"] div.styles_headerContainer__18vw1 a', as => as.map(a => a.href));
        console.log(i);
        for (let link of AllLinks) {
            if (!!link.toString()) set.add(link.toString());
        }
        console.log(set.size);
        console.log(set);
        await page.waitForTimeout(2000);
    }
    //  AllLinks = await page.$$eval('[data-test="StartupResult"] div.styles_headerContainer__18vw1 a', as => as.map(a => a.href));
    //  console.log(AllLinks.length);
    console.log(set.size);
    return set;
};


async function getJobsLink(url, page) {
    //  puppeteerExtra.use(pluginStealth());
    await page.goto(url).catch(e => { });
    /** Get website */
    try {
        var link = await page.$eval('.styles_component__34UEK.styles_component__2yJfJ.styles_about__1wadW .styles_component__DaQ39 .styles_websiteLink__Czyi0 a', a => a.href);
        console.log(link);
    } catch (e) { link = ""; }
    /** Get start-up name */
    const Sname = await page.$eval('.styles_component__1c6JC.styles_defaultLink__1mFc1.styles_anchor__2aXMZ', a => a.innerText);

    try {
        var value = await page.$eval('.styles_component__1YnyN.styles_jobCounter__2iZ-f.styles_red__1FvCF.styles_sm__xD9Ye', element => element.innerText);
    } catch (e) { value = 0; }
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
        if (Filter.includes("Marketing")) {
            await page.waitForTimeout(4000);
            await page.$$eval('.styles_field__LqqCf', selectorMatched => {
                for (i in selectorMatched)
                    if (selectorMatched[i].textContent === 'Marketing') {
                        selectorMatched[i].click();
                    }
            });
        }
        const setLinks = new Set();
        const hrefs = await page.$$eval('.styles_jobList__a_1zA .styles_component__1_YxE.styles_expanded__31zII .styles_component__1c6JC.styles_defaultLink__1mFc1.styles_anchor__1oXto.styles_body__1hjj-', as => as.map(a => a.href)); for (let href of hrefs) {
            if (!!href.toString()) setLinks.add(href.toString());
        }
        //console.log(setLinks);
        return {
            setLinks,
            link,
            Sname,
        }
    }


};


async function getOfferDetails(page, url) {
    //   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    //puppeteerExtra.use(pluginStealth()); 
    await page.goto(url).catch(e => { });
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
    var Description = await page.evaluate(() => {
        return [...document.body.querySelectorAll('.styles_description__4fnTp')]
            .map(element => element.innerText)
            .join('\n');
    });
    Description = Description.replace(/'/gi, "''")
    Description = Description.replace(/"/gi, '')
    Description = Description.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|[\u2708-\uFE0F])/g, '');
    var Contrat = "";
    if (Description.includes('CDI')) Contrat = 'CDI';
    if (Description.includes('CDD')) Contrat = 'CDD';
    if (Description.includes('Alternance')) Contrat = 'Alternance';
    if (Description.includes('Stage')) Contrat = 'Stage';

    /* console.log(j);
      console.log(Poste);
      console.log(Salaire);
      console.log(Location);
      console.log(Skills);
      console.log(Description);*/
    return {


        Poste: Poste,
        Salaire: Salaire,
        Travail: Location,
        Skills: Skills,
        Description: Description,
        Contrat: Contrat,
        Diplome: "",
        Experience: "",

    }


};
async function InitSearch(page, remote, technology) {
    /** Create a new saved search */
    /* await page.waitForTimeout(3000);
     await page.click('[data-test="SavedSearchTab-new"] span span.styles_plusIcon__1nD9X');*/


    /**Choose newest offers */

    await page.waitForSelector(".styles_component__1mMWs > button > svg");
    await page.waitForTimeout(4000);
    await page.click(".styles_component__1mMWs > button > svg");
    await page.waitForTimeout(3000);
    const newest = await page.$$('.styles_component__9NDgl');
    await newest[1].click();


    /** Add location info */
    await page.waitForTimeout(3000);
    var currentValue = await page.$eval('.styles_label__2KDBZ ', currentValue => currentValue.innerText);
    while (currentValue !== 'Add a location') {
        await page.click('.styles_label__2KDBZ ');
        await page.keyboard.press('Backspace');
        await page.click('.styles_component__17zbz');
        currentValue = await page.$eval('.styles_label__2KDBZ', currentValue => currentValue.innerText);
        console.log(currentValue);
    }
    await page.click('[data-test="SearchBar"] > div > .styles_locationWrapper__ScGs8 ');
    await page.keyboard.type('France');
    await page.waitForTimeout(5000);
    await page.keyboard.press('Enter');
    await page.click('.styles_component__17zbz'); //pour desactiver la case
    await page.waitForTimeout(2000);

    /** If it's remote */
    await page.click('.styles_label__3SiOW.styles_blackLabel__u8FI1');
    if (remote == "Yes") { // Yes it's remote
        await page.waitForTimeout(4000);
        await page.evaluate(() => {
            document.querySelector('[id="Only remote jobs"]').click();
        });

    } else {
        if (remote == "No") { // No it's not remote
            await page.waitForTimeout(4000);
            await page.evaluate(() => {
                document.querySelector('[id="No remote jobs"]').click();
            });
        } else { // Both : remote and non remote
            await page.waitForTimeout(4000);
            await page.evaluate(() => {
                document.querySelector('[id="Include remote jobs"]').click();
            });
            await page.waitForTimeout(4000);
        }
    }


    /** write jobs titles */
    var currentValuetitles = await page.$eval('[data-test="SearchBar-RoleSelect-FocusButton"]', currentValuetitles => currentValuetitles.innerText);
    while (currentValuetitles !== 'Add a job title') {
        await page.click('[data-test="SearchBar-RoleSelect-FocusButton"]');
        await page.keyboard.press('Backspace');
        await page.click('.styles_component__17zbz');
        currentValuetitles = await page.$eval('[data-test="SearchBar-RoleSelect-FocusButton"]', currentValuetitles => currentValuetitles.innerText);

    }
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

    await page.click('.styles_component__17zbz'); // pour desactiver la case
    await page.waitForTimeout(3000);
    /**Open filters */
    await page.waitForSelector(".styles_arrowDownIcon__1Ypu8");
    await page.click(".styles_arrowDownIcon__1Ypu8");
    await page.waitForTimeout(50);
    await page.click(".styles_arrowDownIcon__1Ypu8");



    /**Choose job details */
    await page.waitForTimeout(4000);
    //await page.click(".styles_header__PMZlN button"); //clear
    //await page.click('[for="form-input--jobTypes--full_time"]');
    //await page.click('[for="form-input--jobTypes--contract"]');   
    await page.click('.styles_grid__2hFuG [data-test="AutocompleteWithRecommendationsField--skills"] > div .styles_wrapper__6OGlQ')
    for (let i = 0; i < technology.length - 1; i++) {
        await page.keyboard.type(technology[i].toString());
        await page.waitForTimeout(4000);

        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(4000);
    }
    /**Click on view result */
    await page.click('[data-test="SearchBar-ViewResultsButton"]');
    await page.waitForTimeout(5000);

};

(async () => {
    /** Solve captcha problem */


    var technology = []; var i = 0;
    technology[0] = readline.question('Technologies: (to select all press Enter) ');
    while (technology[i] != "") {
        i++;
        technology[i] = readline.question('add technlology? ');
    }

    const remote = readline.question('Is it remote?(Yes/Enter) ');

    puppeteerExtra.use(pluginStealth());
    const browser = await puppeteerExtra.launch({ headless: false, defaultViewport: null, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', });

    try {
        const page = await browser.newPage();

        await page.setUserAgent(userAgent.toString());
        await page.goto('https://angel.co/login');
        await page.waitForTimeout(4000);


        // evaluate returns before the submit / captcha callback so wait 1 second.



        var start = performance.now();
        /** Login */
        await page.click(USERNAME_SELECTOR);
        await page.$eval('#user_email', email => email.value = 'hl_medjahed@esi.dz');
        await page.click(PASSWORD_SELECTOR);
        await page.$eval('#user_password', password => password.value = 'lamiamedjahed');
        await page.click(SUBMIT_SELECTOR);
        await page.waitForTimeout(20000);
        /**Dismiss */
        await page.waitForSelector(".styles_dismiss__2NKYW");
        await page.click(".styles_dismiss__2NKYW");
        /** Initialise inputs */
        await InitSearch(page, remote, technology);
        await page.waitForTimeout(4000);

        /** Scroll to get all Stratup-ups */
        const Slinks = await scroll(page);
        await page.waitForTimeout(3000);
        var scrapedData = [];
        var scrapedStartup = [];
        var j = 1; // indice batch for offers
        var l = 1 // indice batch for startups
        var numberOffre = 1;
        var numberStartup = 1;
        var IdStartup = 1;

        for (let Slink of Slinks) {

            await page.waitForTimeout(3000);

            const objects = await getJobsLink(Slink + '/jobs', page); // Slink is the link of the startup=> from Scroll function
            /*  const startupInfo = {
                  
                  Startup :'',
                  StartupLink :'',
                  SourceID : 3,
              }
              startupInfo.Startup=objects.Sname;
              startupInfo.StartupLink= objects.link;*/
            /*scrapedStartup.push(startupInfo);
            var outputFile1 = './startups/batch-'+numberStartup+'.csv';
             
            writeCSVStartup(scrapedStartup, outputFile1);
            l++;
            if (l % 5000 == 0) {
                 numberStartup++;
                 scrapedStartup = [];
             }*/
            if (objects.setLinks.size != 0) {
                var startupInfo = [[objects.Sname, objects.link, 3]]

                //startups.push(startup)
                let query = "INSERT IGNORE INTO startup (name,website,sourceID) VALUES ?"
                con.query(query, [startupInfo], (error, response) => {
                    console.log(error || response);
                    return idstartup = response.insertId
                })



                for (let lien of objects.setLinks) {
                    console.log('Inside loop');
                    const Startup = objects.Sname; const link = objects.link;
                    console.log(Startup, link);
                    await page.waitForTimeout(3000);
                    const data = await getOfferDetails(page, lien);
                    /*scrapedData.push(data);
                    console.log(data);
                  
                    
                    var outputFile2 = './offres/batch-' + numberOffre + '.csv';
                          writeCSV(scrapedData, outputFile2);
                          j++; 
                          if (j % 5000 == 0) {
                            numberOffre++;
                            scrapedData = [];
                          }
                          var Middle1=performance.now();
                          if (((Middle1-start)/3600000) % 1 ==0){
                              waitForTimeout(600000);
                          }
               }
               IdStartup++;*/
                    var offre = [[data.Poste, data.Contrat, data.Salaire, data.Diplome, data.Experience, data.Travail, data.Description, idstartup, data.Skills]]
                    query = "insert into offre (poste,contrat,salaire,diplome,experience,travail,description,startupID,skills) Select '" + data.Poste + "','" + data.Contrat + "','" + data.Salaire + "','" + data.Diplome + "','" + data.Experience + "','" + data.Travail + "','" + data.Description + "'," + idstartup + ",'" + data.Skills + "' Where not exists(select * from offre where description  ='" + data.Description + "')"
                    con.query(query, (error, response) => {
                        console.log('OFFRE', error || response);
                    })

                    var Middle2 = performance.now();
                    if (((Middle2 - start) / 3600000) % 2 == 0) {
                        waitForTimeout(1800000);
                    }

                }
            }
            var end = performance.now();
            console.log('execution time: ', (end - start) / 60000, 'm');
            //  browser.close();   
        }
    } catch (e) {

        console.error('THIS IS YOUR ERROR $e', e);
        var end = performance.now();
        console.log('execution time: ', (end - start) / 60000, 'm');
        //  browser.close();


    }

})();
