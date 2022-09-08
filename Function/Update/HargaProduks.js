const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const TarikProduks = require("../Routes/TarikProduks");
const UpdateProduk = require("../Routes/UpdateProduk");

let ScrapUpdate = false;

function ScrapUpdateCek(res) {
  if (ScrapUpdate === true) {
    res = `Status Scrap dan Update Aktif`;
  } else {
    res = `Status Scrap dan Update NonAktif`;
  }
  return res;
}
async function ScrapUpdateOn(res) {
  if (ScrapUpdate === false) {
    ScrapUpdate = true;
    ScrapHargaProduk();
    res = `Mengaktifkan Scrap dan Update`;
  } else {
    res = `Status Telah Aktif`;
  }
  return res;
}
function ScrapUpdateOff(res) {
  ScrapUpdate = false;
  res = `Menonaktifkan Scrap dan Update`;
  return res;
}

async function ScrapHargaProduk() {
  console.log("Persiapan Data Produk Dimulai");
  const Produks = await TarikProduks();
  if (Produks.length !== 0) {
    let i = 0;
    ProduksLoop();
    async function ProduksLoop() {
      let Berhasil = 1;
      let data = Produks[i];
      const browser = await puppeteer.launch({ headless: false }); // Membuka Browser
      try {
        const page = await browser.newPage(); // Membuka Tab Baru di Browser
        console.log(`Update Produk ${i} : ${data.kodebarang} - ${data.namabarang}`);
        if (data.linkproduk !== "-") {
          await page.goto(data.linkproduk);
          try {
            await page.waitForSelector("[class='_1WIqzi']", { timeout: 3000 });
            let statusclass = await page.$("[class='_1WIqzi']");
            let statusvalue = await page.evaluate((el) => el.textContent, statusclass);
            data.linkstatus = statusvalue;
            console.log(`Status link Produk ${data.kodebarang} : ${statusvalue}`);
          } catch (error) {
            data.linkstatus = "aktif";
            await page.waitForSelector("[class='_2Shl1j']");
            let element = await page.$("[class='_2Shl1j']");
            let value = await page.evaluate((el) => el.textContent, element);
            value = value.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");
            if (value.includes("-") === true) {
              value = value.split("-");
              if (data.hargaprodukmin == false) {
                value = value[1];
              } else {
                value = value[0];
              }
              data.hargaproduk = value;
            } else {
              data.hargaproduk = value;
            }
            console.log(`Status Link Produk ${data.kodebarang} Aktif - Harga Berhasil didapatkan : Rp.${value}`);
          }
        } else {
          data.linkstatus = "Kosong";
          console.log(`Status Link Produk ${data.kodebarang} : Kosong`);
        }
        if (data.pesaing[0].linkpesaing != "-") {
          await page.goto(data.pesaing[0].linkpesaing);
          try {
            await page.waitForSelector("[class='_1WIqzi']", { timeout: 3000 });
            let statusclass0 = await page.$("[class='_1WIqzi']");
            let statusvalue0 = await page.evaluate((el) => el.textContent, statusclass0);
            data.pesaing[0].linkpesaingstatus = statusvalue0;
            console.log(`Status Link Pesaing ${data.pesaing[0].namapesaing} : ${statusvalue0}`);
          } catch (error) {
            await page.waitForSelector("[class='_2Shl1j']");
            let element0 = await page.$("[class='_2Shl1j']");
            let value0 = await page.evaluate((el) => el.textContent, element0);
            value0 = value0.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");
            if (value0.includes("-") === true) {
              value0 = value0.split("-");
              if (data.pesaing[0].hargapesaingmin == false) {
                value0 = value0[1];
              } else {
                value0 = value0[0];
              }
              data.pesaing[0].hargapesaing = value0;
            } else {
              data.pesaing[0].hargapesaing = value0;
            }
            console.log(
              `Status Link Pesaing ${data.pesaing[0].namapesaing} Aktif - Harga Berhasil didapatkan : Rp.${value0}`
            );
          }
        } else {
          data.pesaing[0].linkpesaingstatus = "Kosong";
          console.log(`Status Link Pesaing ${data.pesaing[0].namapesaing} : Kosong`);
        }
        if (data.pesaing[1].linkpesaing != "-") {
          await page.goto(data.pesaing[1].linkpesaing);
          try {
            await page.waitForSelector("[class='_1WIqzi']", { timeout: 3000 });
            let statusclass1 = await page.$("[class='_1WIqzi']");
            let statusvalue1 = await page.evaluate((el) => el.textContent, statusclass1);
            data.pesaing[1].linkpesaingstatus = statusvalue1;
            console.log(`Status link Pesaing ${data.pesaing[1].namapesaing} : ${statusvalue1}`);
          } catch (error) {
            await page.waitForSelector("[class='_2Shl1j']");
            let element1 = await page.$("[class='_2Shl1j']");
            let value1 = await page.evaluate((el) => el.textContent, element1);
            value1 = value1.replace(/Rp/g, "").replace(/ /g, "").replace(".", "").replace(".", "");

            if (value1.includes("-") === true) {
              value1 = value1.split("-");
              if (data.pesaing[1].hargapesaingmin == false) {
                value1 = value1[1];
              } else {
                value1 = value1[0];
              }
              data.pesaing[1].hargapesaing = value1;
            } else {
              data.pesaing[1].hargapesaing = value1;
            }
            console.log(
              `Status Link Pesaing ${data.pesaing[1].namapesaing} Aktif - Harga Berhasil didapatkan : Rp.${value1}`
            );
          }
        } else {
          data.pesaing[1].linkpesaingstatus = "Kosong";
          console.log(`Status Link Pesaing ${data.pesaing[1].namapesaing} : Kosong`);
        }

        const UpdateStatus = await UpdateProduk(data);
        console.log(UpdateStatus);
      } catch (error) {
        console.log(
          `Shopee Menghentikan Proses Scraping!
Proses Scraping akan dilanjutkan kembali setelah 90 detik...`
        );
        Berhasil = 0;
      }
      await browser.close();

      if (Berhasil === 1) {
        i++;
        if (i < Produks.length) {
          if (ScrapUpdate === true) {
            ProduksLoop();
          }
        } else {
          UlangiScrap();
        }
      } else {
        setTimeout(() => {
          if (i < Produks.length) {
            if (ScrapUpdate === true) {
              ProduksLoop();
            }
          }
        }, 60000);
      }
    }
    function UlangiScrap() {
      console.log(`Berhasil MenScraping dan Mengupdate ${i} Produk\nMengulagi Proses Dalam 30m...`);
      setTimeout(ScrapHargaProduk, 1800000);
    }
  }
}

module.exports = { ScrapUpdateOn, ScrapUpdateOff, ScrapUpdateCek };
