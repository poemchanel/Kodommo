const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { setTimeout } = require("timers/promises");

let Browser;
let Setting = {
  Headless: true, // Show Puppeteer Browser
  UseTor: false, // Use Tor Service
  TorOn: false, // Tor State
  Tor: "socks5://127.0.0.2:9052", // Proxy Tor Service URL
  ShopeeAPI: "https://shopee.co.id/api/v4/item/get?", // Shopeee API URL
  BrowserState: "BN",
};

async function OpenBrowser() {
  if (Setting.TorOn === true) {
    Browser = await puppeteer.launch({ headless: Setting.Headless, args: [`--proxy-server=${Setting.Tor}`] });
  } else {
    Browser = await puppeteer.launch({ headless: Setting.Headless });
  }
  Setting.BrowserState = Setting.TorOn === true ? "BP" : "BN";
} // Opening Puppeteer Browser

async function Scraping(Shopee, Res) {
  let done = false;
  let Json = {};
  await OpenBrowser();
  const Page = await Browser.newPage();
  try {
    // Intercept Request
    await Page.setRequestInterception(true);
    Page.on("request", (request) => {
      if (request.resourceType() == "font" || request.resourceType() === "image") {
        request.abort();
      } else {
        if (Json.data === undefined) request.continue();
      }
    });
    Page.on("response", async (response) => {
      try {
        if (response.url().startsWith(Setting.ShopeeAPI)) Json = await response.json();
      } catch (error) {}
    });
    await Page.goto(Shopee.link, { waitUntil: "networkidle0" });
    // Check Status
    try {
      await Page.waitForSelector("[class='R5BcWE']", { timeout: 1500 });
      let StatusClass = await Page.$("[class='R5BcWE']");
      let StatusValue = await Page.evaluate((el) => el.textContent, StatusClass);
      Shopee.status = StatusValue === "Diarsipkan" ? "Diarsipkan" : "Habis";
    } catch (error) {
      Shopee.status = "Active";
    }
    // Check Price
    try {
      await Page.waitForSelector("[class='_2Shl1j']", { timeout: 1500 });
      let PriceClass = await Page.$("[class='_2Shl1j']");
      let PriceValue = await Page.evaluate((el) => el.textContent, PriceClass);
      PriceValue = PriceValue.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", ""); // Filter
      if (PriceValue.includes("-") === false) {
        Shopee.harga = PriceValue;
        done = true;
      } else {
        if (Shopee.status === "Active") {
          if (Shopee.kategori === undefined) {
            Shopee.status = "Option";
            done = true;
          } else {
            if (Shopee.kategori !== "") {
              let Models = Json.data.models;
              let index = await Models.findIndex((f) => f.name === Shopee.kategori);
              Shopee.harga = parseInt(Models[index].price.toString().slice(0, -5));
              Shopee.stock = Models[index].normal_stock;
              Shopee.status = Shopee.stock === 0 ? "Habis" : "Active";
              done = true;
            } else done = true;
          }
        } else {
          done = true;
        }
      }
    } catch (error) {
      Shopee.status = "Error1";
      if (Setting.UseTor === true) Setting.TorOn = !Setting.TorOn;
      done = true;
    }
  } catch (error) {
    Shopee.status = "Error0";
    done = true;
  }
  for (let z = 0; done === false; z++) {
    await setTimeout(500);
  }
  await Browser.close();
  Shopee.diupdate = new Date();
  const Log =
    Shopee.status === "Active"
      ? `│ -${Setting.BrowserState} Produk ${Shopee.nama} link Active\n│   ╰ Harga : Rp.${Shopee.harga}`
      : `│ -${Setting.BrowserState} Produk ${Shopee.nama} link ${Shopee.status}`;
  Res = { shopee: Shopee, log: Log, tor: Setting.UseTor };
  return Res;
} // Scraping Data

module.exports = Scraping; //Exporting Funtion
