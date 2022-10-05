const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { setTimeout } = require("timers/promises");

const UpdateProduk = require("../Routes/Products/Update");

async function HargaProduk(Produks, res) {
  let log = [];
  let data = Produks;
  log.push(`│Memulai Update : ${data.konveksi}-${data.kodebarang}`);
  shopee = data.shopee;
  if (shopee !== undefined) {
    for (let j = 0; j < shopee.length; j++) {
      if (ScrapUpdate === true) {
        if (shopee[j].link !== "-" && shopee[j].link !== "") {
          interfered = false;
          const browser = await puppeteer.launch({ headless: true }); // Membuka Browser
          const page = await browser.newPage();
          try {
            for (let k = 0; k < 1; k++) {
              if (shopee[j].api === undefined) {
                // Jika API URL Kosong
                page.on("request", (request) => {
                  if (request.url().startsWith("https://shopee.co.id/api/v4/item/get?")) {
                    shopee[j].api = {};
                    shopee[j].api.url = request.url();
                  }
                  request.continue();
                });
                await page.goto(shopee[j].link);
                await setTimeout(5000);
                k = k - 1;
              } else {
                // Jika API url Tersedia
                await page.goto(shopee[j].api.url);
                let raw = await page.$eval("*", (el) => el.innerText);
                let json = JSON.parse(raw);
                let samestocks = json.data.normal_stock;
                let models = json.data.models;
                if (shopee[j].status === "New") {
                  let sameprice = models.every((m, i, f) => m.price === f[0].price);
                  if (sameprice === true) {
                    shopee[j].harga = parseInt(models[0].price.toString().slice(0, -5));
                    shopee[j].api.stockcombine = true;
                    shopee[j].api.name = models[0].name;
                    shopee[j].api.stock = samestocks;
                    samestocks === 0 ? (shopee[j].status = "Active") : (shopee[j].status = "Habis");
                  } else {
                    shopee[j].status = "Option";
                    shopee[j].api.stockcombine = false;
                  }
                  shopee[j].status === "Active"
                    ? log.push(`│->Produk ${shopee[j].nama} link Active\n│   ╰ Harga : Rp.${shopee[j].harga}`)
                    : log.push(`│->Produk ${shopee[j].nama} link ${shopee[j].status}`);
                } else {
                  if (shopee[j].api.name !== "") {
                    let index = models.findIndex((f) => f.name === shopee[j].api.name);
                    shopee[j].harga = parseInt(models[index].price.toString().slice(0, -5));
                    if (shopee[j].api.stockcombine !== true) {
                      shopee[j].api.stock = models[index].normal_stock;
                      models[index].normal_stock === 0 ? (shopee[j].status = "Active") : (shopee[j].status = "Habis");
                    } else {
                      shopee[j].api.stock = samestocks;
                      samestocks === 0 ? (shopee[j].status = "Active") : (shopee[j].status = "Habis");
                    }
                  }
                  shopee[j].status === "Active"
                    ? log.push(`│->Produk ${shopee[j].nama} link Active\n│   ╰ Harga : Rp.${shopee[j].harga}`)
                    : log.push(`│->Produk ${shopee[j].nama} link ${shopee[j].status}`);
                }
              }
            }
          } catch (error) {
            console.log(error);
            shopee[j].status = "Skip";
            log.push(`│->Produk ${shopee[j].nama} Skip`);
            failed.push(`│${data.konveksi}-${data.kodebarang}-${shopee[j].nama}`);
            await setTimeout(60000);
          }
          await browser.close();
        } else {
          shopee[j].status = "NoLink";
          log.push(`│->Produk ${shopee[j].nama} NoLink`);
        }
      }
    }
  } else {
    log.push(`│Produk ${data.konveksi}-${data.kodebarang} NoLink`);
  }
  const UpdateStatus = await UpdateProduk(data);
  log.push(`│${UpdateStatus}`);
  res = { log: log };

  return res;
}

module.exports = HargaProduk;
