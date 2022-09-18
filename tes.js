const puppeteer = require("puppeteer");

let url;
let json;
let wait;
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1200, height: 800 });

  await page.setRequestInterception(true);

  page.on("request", (request) => {
    if (request.url().startsWith("https://shopee.co.id/api/v4/item/get?")) {
      url = request.url();
    }
    // console.log(">>", request.method(), request.url());
    request.continue();
  });

  page.on("response", async (response) => {
    if (response.url().startsWith("https://shopee.co.id/api/v4/item/get?")) {
      json = await response.json();
    }
    // console.log("<<", response.status(), response.url());
  });

  await page.goto(
    "https://shopee.co.id/-COD-Tas-ransel-Cewek-Remaja-SMP-SMA-Tas-ransel-sekolah-anak-Perempuan-Tas-Ransel-Sekolah-Murah-Tas-sekolah-Tas-sekolah-cewek-Terbaru-2022-Bahan-Kanvas-Tebal-(D300)-i.252791457.17700022560?sp_atk=ee901586-22d6-4fe2-972b-c7b94ce9d488&xptdk=ee901586-22d6-4fe2-972b-c7b94ce9d488"
  );

  // await page.screenshot({ path: 'screenshot.png' })
  await browser.close();
  console.log(url);
  console.log(json.data.models);
  console.log(wait);
})();

// const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
// puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
// puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// let URL = `https://shopee.co.id/api/v4/item/get?itemid=1919899204&shopid=20287667`;
// async function Tes() {
//   const browser = await puppeteer.launch({ headless: false }); // Membuka Browser
//   const page = await browser.newPage();

//   await page.goto(URL);
//   const raw = await page.$eval("*", (el) => el.innerText);
//   const json = JSON.parse(raw);
//   const models = json.data.models;
//   let IndexFirst = models.findIndex((f) => f.name === "KUNING");

//   await browser.close();
//   console.log(models[IndexFirst].price);
// }

// Tes();
