const puppeteer = require('puppeteer');

async function getJobsLink(url) {
    await page.goto(url);
    /** Get website */
    const link = await page.$eval('.styles_component__34UEK.styles_component__2yJfJ.styles_about__1wadW .styles_component__DaQ39 .styles_websiteLink__Czyi0 a', a => a.href);
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


        const hrefs = await page.$$eval('[data-test="JobsTab"] div .styles_jobList__a_1zA .styles_component__1_YxE.styles_expanded__31zII a', as => as.map(a => a.href));

        return { hrefs, link, Sname, }
    }


};