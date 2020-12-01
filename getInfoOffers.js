const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const readline = require('readline-sync');
const performance = require('perf_hooks').performance;


async function getInfoOffers(url,Sname,Slink) {
  await page.goto(url);
  await page.waitForTimeout(20000);

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

  console.log(Poste);
  console.log(Salaire);
  console.log(Location);
  console.log(Skills);
  console.log(Description);
  return{
      StartupName= Sname,
      StartupLink = Slink,
      Poste,
      Salaire,
      Location,
      Skills,
      Description,
  }


};