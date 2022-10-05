const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { setTimeout } = require("timers/promises");

const UpdateProduk = require("../Routes/UpdateProduk");

async function HargaProduk(Produks, res) {
  let log = [];
  let data = Produks;
  const browser = await puppeteer.launch({ headless: true }); // Membuka Browser
  const page = await browser.newPage();
  log.push(`│Memulai Update : ${data.konveksi}-${data.kodebarang}`);
  shopee = data.shopee;
  if (shopee !== undefined) {
    for (let j = 0; j < shopee.length; j++) {
      if (shopee[j].link !== "-") {
        try {
          await page.goto(shopee[j].link);
          try {
            await page.waitForSelector("[class='_1WIqzi']", { timeout: 3000 });
            let statusclass = await page.$("[class='_1WIqzi']");
            let statusvalue = await page.evaluate((el) => el.textContent, statusclass);
            shopee[j].status = statusvalue;
            log.push(`│->Produk ${shopee[j].nama} link ${statusvalue}`);
          } catch (error) {
            try {
              let disable = [];
              for (let k = 0; k < shopee[j].click.length; k++) {
                let element = await page.waitForSelector(`button[aria-label="${shopee[j].click[k]}"]`);
                let button = await page.evaluate((el) => el.getAttribute("aria-disabled"), element);
                if (button === false) {
                  await page.click(`button[aria-label="${shopee[j].click[k]}"]`);
                }
                disable.push(button);
              }
              console.log(disable);
              if (disable.includes("true") === true) {
                shopee[j].status = "Disable";
                log.push(`│->Produk ${shopee[j].nama} link Disable`);
              } else {
                await setTimeout(500);
                try {
                  await page.waitForSelector("[class='_2Shl1j']");
                  let element = await page.$("[class='_2Shl1j']");
                  let value = await page.evaluate((el) => el.textContent, element);
                  value = value.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");
                  if (value.includes("-") === true) {
                    shopee[j].harga = value;
                    shopee[j].status = "Range";
                    log.push(`│->Produk ${shopee[j].nama} link Range\n│   ╰ Harga : Rp.${value}`);
                  } else {
                    shopee[j].harga = value;
                    shopee[j].status = "Aktif";
                    log.push(`│->Produk ${shopee[j].nama} link Aktif\n│   ╰ Harga : Rp.${value}`);
                  }
                } catch (error) {
                  console.log(error);
                  log.push(`│Proses scraping terhenti!\n│melanjutkan ulang proses\n│setelah 90 detik...`);
                }
              }
            } catch (error) {
              try {
                await page.waitForSelector("[class='_2Shl1j']");
                let element = await page.$("[class='_2Shl1j']");
                let value = await page.evaluate((el) => el.textContent, element);
                value = value.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");
                if (value.includes("-") === true) {
                  shopee[j].harga = value;
                  shopee[j].status = "Range";
                  log.push(`│->Produk ${shopee[j].nama} link Range\n│   ╰ Harga : Rp.${value}`);
                } else {
                  shopee[j].harga = value;
                  shopee[j].status = "Aktif";
                  log.push(`│->Produk ${shopee[j].nama} link Aktif\n│   ╰ Harga : Rp.${value}`);
                }
              } catch (error) {
                console.log(error);
                log.push(`│Proses scraping terhenti!\n│melanjutkan ulang proses\n│setelah 90 detik...`);
              }
            }
          }
        } catch (error) {
          shopee[j].status = "Bermasalah";
          log.push(`│->Produk ${shopee[j].nama} link Bermasalah`);
        }
      } else {
        shopee[j].link = "Kosong";
        log.push(`│->Produk ${shopee[j].nama} link Kosong`);
      }
    }
  } else {
    log.push(`│Produk ${data.konveksi}-${data.kodebarang} Link Kosong`);
  }
  await browser.close();
  const UpdateStatus = await UpdateProduk(data);
  log.push(`│${UpdateStatus}`);
  res = { log: log };

  return res;
}

module.exports = HargaProduk;
