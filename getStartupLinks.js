const puppeteer = require('puppeteer');

/** Function for scrolling */
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 2000;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
               waitForTimeout(3000);
                totalHeight += distance;
                
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 1000);
        });
    });
    return totalHeight;
}
(async ()=> {
    var totalHeight0 = 0;
    var totalHeight1=1;
    var stop = false;
    var set = new Set();
    while(stop==false){
    if(totalHeight1>totalHeight0){
    var AllLinks = await page.$$eval('[data-test="StartupResult"] div a', as => as.map(a => a.href));
    for(let link of AllLinks){
    set.add(link.toString());
    }
    totalHeight0 = totalHeight1;
    totalHeight1 =  autoScroll(page);
    }else {stop = true;}
    }
})();