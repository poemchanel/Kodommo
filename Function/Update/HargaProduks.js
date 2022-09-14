const puppeteer = require("puppeteer-extra"); // Export Module untuk Scraping Web
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const { setTimeout } = require("timers/promises");

const TarikProduks = require("../Routes/TarikProduks");
const UpdateProduk = require("../Routes/UpdateProduk");

let ScrapUpdate = false;
let log = [];
let updated = 0;
let produklength = 0;
let queue = 0;
let finish = false;
let stop = 0;
let i = 0;
let Berhasil = 0;
let Produks;
let failed = [];

// const HubungkanDatabase = require("../Routes/HubungkanDatabase");
// HubungkanDatabase();
// ScrapUpdateOn();

function AutoCek(res) {
  if (ScrapUpdate === true) {
    res = {
      status: `│Status Auto Scrap\n│dan Update Aktif`,
      log: log,
      diupdate: updated,
      totalproduk: produklength,
      antrian: queue,
      state: ScrapUpdate,
      gagal: failed,
    };
  } else {
    res = {
      status: `│Status Auto Scrap\n│dan Update NonAktif`,
      log: log,
      diupdate: updated,
      totalproduk: produklength,
      antrian: queue,
      state: ScrapUpdate,
      gagal: failed,
    };
  }
  return res;
}
function AutoOn(res) {
  if (ScrapUpdate === false) {
    ScrapUpdate = true;
    PersiapanData();
    res = {
      status: `│Mengaktifkan Auto\n│Scrap dan Update`,
      log: log,
      diupdate: updated,
      totalproduk: produklength,
      antrian: queue,
    };
  } else {
    res = {
      status: `│Status Auto Scrap\n│dan Update Telah Aktif`,
      log: log,
      diupdate: updated,
      totalproduk: produklength,
      antrian: queue,
    };
  }
  return res;
}
function AutoOff(res) {
  ScrapUpdate = false;
  res = {
    status: `│Menonaktifkan Auto Scrap\n│dan Update`,
    log: log,
    diupdate: updated,
    totalproduk: produklength,
    antrian: queue,
  };
  return res;
}
function AutoSelesai(res) {
  res = {
    nomor: "120363043606962064@g.us",
    status: `Auto Update Selesai`,
    log: log,
    diupdate: updated,
    totalproduk: produklength,
    antrian: queue,
    selesai: finish,
  };
  if (finish === true) {
    finish = false;
  }
  return res;
}

function Restart() {
  finish = true;
  log.push(`│Berhasil MenScraping ${i} Produk\nMengulang Proses Dalam 30m...`);
  // setTimeout(Tunggu, 1800000);
  setTimeout(Tunggu, 60000);

  function Tunggu() {
    log = [];
    updated = 0;
    queue = 0;
    PersiapanData();
  }
}
function Ulang() {
  if (Berhasil === 1) {
    i++;
    if (i < produklength) {
      if (ScrapUpdate === true) {
        ProduksLoop();
      }
    } else {
      Restart();
    }
  } else {
    i++;
    setTimeout(() => {
      if (i < produklength) {
        if (ScrapUpdate === true) {
          ProduksLoop();
        }
      } else {
        Restart();
      }
    }, 60000);
  }
}

async function PersiapanData() {
  Produks = await TarikProduks();
  produklength = Produks.length;
  i = queue;
  if (produklength !== 0) {
    ProduksLoop();
  }
}
async function ProduksLoop() {
  stop = 0;
  queue = i;
  Berhasil = 1;
  if (log.length > 30) {
    log.splice(0, 5);
  }
  let data = Produks[i];
  if (ScrapUpdate === true) {
    const browser = await puppeteer.launch({ headless: false }); // Membuka Browser
    const page = await browser.newPage();
    log.push(`│Memulai Update ${i}: ${data.konveksi}-${data.kodebarang}`);
    shopee = data.shopee;
    for (let j = 0; j < shopee.length; j++) {
      if (ScrapUpdate === true) {
        if (shopee[j].link !== "-") {
          try {
            await page.goto(shopee[j].link);
            try {
              await page.waitForSelector("[class='_1WIqzi']", { timeout: 2000 });
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
                    Berhasil = 0;
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
                  Berhasil = 0;
                  failed.push(`${i}: ${data.konveksi}-${data.kodebarang}`);
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
      } else {
        stop = stop + 1;
      }
    }
    await browser.close();
    if (ScrapUpdate === true) {
      const UpdateStatus = await UpdateProduk(data);
      updated = updated + 1;
      log.push(`│${UpdateStatus}`);
    } else {
      stop = stop + 1;
    }
  } else {
    stop = stop + 1;
  }
  if (stop > 0) {
    i = i - 1;
  }
  Ulang();
}

module.exports = { AutoOn, AutoOff, AutoCek, AutoSelesai };
